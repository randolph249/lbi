//创建商圈 directive
lbiApp.directive('creatcircle', ['safeApply', function(safeApply) {
  var linkFunc = function($scope, iElm, iAttrs, ctrl) {
    $scope.poiname = '';

    //保存POI接口提供的POI name
    //进行比较输入框是否于接口提供的POI name 一致
    var originpoiname;

    //接受citymenu directive发送的选中城市信息
    $scope.checkcity = function(poi) {
      $scope.cityname = poi.cityname;
      originpoiname = poi.poiname;
      $scope.poiname = poi.poiname;
      $scope.citycode = poi.citycode;

      $scope.lng = poi.poi_x;
      $scope.lat = poi.poi_y;
      $scope.center = [poi.poi_x, poi.poi_y];
    };

    //typeahead的配置项
    $scope.typeahead = {};

    //创建autocomplete 数据集合
    $scope.typeahead.datasets = {
      displayKey: 'name',
      name: 'states',
      source: function(q, cb) {
        //添加监听数据更新 当数据更新以后
        var addListener = $scope.$on('UPDATE_DATASOURCE',
          function(e, datasource) {
            cb(datasource);
            $.type(addListener) == 'function' && addListener();
          });
        return false;
      },
      templates: {
        empty: ['<div class="search-empty">', '未找到对应地址信息', '</div>'].join(
          '\n'),
        suggestion: Handlebars.compile([
          '<div class="search-result">',
          '<p class="search-result-poiname">{{name}}</p>',
          '<p class="search-result-address">',
          '<i class="iconfont icon-location"></i>',
          '{{address}}',
          '</p>',
          '</div>'
        ].join(''))
      }
    };

    //配置autocomplete options
    $scope.typeahead.options = {
      minLength: 2,
      highlight: true
    };


    //当typeahead的时候 更前当前POI信息
    $scope.$on('typeahead:selected', function(e, suggestion, dataset) {
      safeApply($scope, function() {
        originpoiname = suggestion.name;
        $scope.poiname = suggestion.name;
        $scope.lng = suggestion.location.lng;
        $scope.lat = suggestion.location.lat;
        $scope.center = [suggestion.location.lng, suggestion.location
          .lat
        ];
      });
    });

    $scope.$on('typeahead:closed', function(e, suggestion, dataset) {
      // console.log($scope.poiname);
      if ($scope.poiname !== originpoiname) {
        $scope.poiname = "";
      }
    });

    //是否允许添加POI
    $scope.isOk = function() {
      if (!$.trim($scope.name).length || $scope.poiname !=
        originpoiname) {
        return true;
      }
      return false;
    }

    //商圈半径
    $scope.radius = 3000;
    $scope.slidebar = {
      options: {
        range: 'min',
        value: $scope.radius,
        min: 0,
        max: 7000,
        step: 100
      }
    };

    $scope.updateRadius = function(value) {
      $scope.radius = value;
    }

    //向parent controller 广播信息
    $scope.emitToParent = function() {
      $scope.confirmcall({
        params: {
          circletype: $scope.circletype,
          name: $scope.name,
          radius: $scope.radius,
          citycode: $scope.citycode,
          city: $scope.cityname,
          x: $scope.center[0],
          y: $scope.center[1]
        }
      });
    };


    //取消创建
    $scope.cancel = function() {
      $scope.cancelcall();
    }
  };
  return {
    templateUrl: 'createcircle.html',
    scope: {
      confirmcall: '&',
      cancelcall: '&'
    },
    compile: function($scope, iElm, iAttrs) {
      return {
        pre: linkFunc
      }
    }
  }
}]);
