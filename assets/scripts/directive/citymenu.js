//城市列表菜单
lbiApp.directive('citymenu', [
  'safeApply',
  '$timeout',
  'cityListResource',
  function(safeApply, $timeout, cityListResource) {

    var compile = function($scope, iElm, iAttrs) {
      return {
        pre: function() {},
        post: posted
      };
    };
    var posted = function($scope, iElm, iAttrs) {
      $scope.citylist = [];

      //设置城市数据来源
      var isLocalSource = iAttrs.isLocalSource === 'false' ? false : true;

      //从外部获取数据
      if (isLocalSource) {
        //获取城市列表信息
        cityListResource.query().then(function(list) {
          inited($scope, iElm, iAttrs, list);
        });
      } else {

        // 内部数据 （无过滤.默认全国所有城市）
        iAttrs.$observe('source', function(source) {
          var reg = /\[.+\]/;

          if (source && reg.test(source)) {
            source = JSON.parse(source);
            inited($scope, iElm, iAttrs, source);
          }
        })
      }


    };
    var inited = function($scope, iElm, iAttrs, list) {

      $scope.citylist = list;

      $scope.hotCitylist = [];

      var hotCitykeys = "北京市,上海市,广州市,深圳市,杭州市,天津市,成都市,重庆市";

      var formatcitylistByDelpro = function(citylist) {
        var formatArr = [];
        $.each(citylist,
          function(index, item) {
            formatArr = formatArr.concat(item.citys);
            //获取热门城市

            $.each(item.citys, function(index, city) {
              if (hotCitykeys.indexOf(city.cityname) != -1) {
                $scope.hotCitylist.push(city);
              }
            });

          });
        return formatArr;
      };

      //typeahead 插件直接使用的数
      var citylistForTypeahead = formatcitylistByDelpro($scope.citylist);

      $scope.defaultCity = $scope.hotCitylist.length ? $scope.hotCitylist[0]['cityname'] : list[0]['citys'][0]['cityname']; //设置默认城市



      var citylistSearchDom = $('#city-srh-ipt', iElm);
      //通过城市名称和城市拼音去筛选数据
      var queryByName = function(datasource, q) {
        return $.grep(datasource,
          function(item) {
            q = q.toUpperCase();
            return item.cityname.indexOf(q) !== -1;
          });
      };

      //初始化typeahead
      citylistSearchDom.typeahead({
        highlight: true
      }, {
        name: 'states',
        displayKey: 'cityname',
        //用户输入的查询KEY有两种 一个是城市中文名 一个是城市拼音
        source: function(q, cb) {
          cb(queryByName(citylistForTypeahead, q));
        },
        templates: {
          empty: ['<div class="empty-message">', '未找到对应城市', '</div>'].join('\n'),
          suggestion: Handlebars.compile('<p>{{cityname}}</p>')
        }
      });


      //监听typeahead selected事件
      citylistSearchDom.on('typeahead:selected', function(e, item) {
        safeApply($scope, function() {

          broadcastCheckedCity(item);
        });
      });

      //广播给parent controller选中城市信息
      var broadcastCheckedCity = function(item) {
        $scope.defaultCity = item.cityname;
        $scope.display = false;

        $scope.checkedcall({
          poi: $.extend(item, {
            lng: item.x,
            lat: item.y
          })
        });
      };

      //点击选择城市信息
      $scope.selectcity = function(item) {
        broadcastCheckedCity(item);
      };

      //默认城市 function
      var setDefaulCity = function(cityname) {
        var finalIndex = -1;
        $.each(citylistForTypeahead, function(i, item) {
          if (item.cityname.indexOf(cityname) !== -1) {
            finalIndex = i;
            return false;
          }
        });
        finalIndex != -1 && broadcastCheckedCity(citylistForTypeahead[finalIndex]);
      };
      //设置默认城市

      //判断是否有定位请求
      var localReq = Boolean(iAttrs.localReq);
      //1.2.1版本添加位置定位功能
      if (localReq) {
        $timeout(function() {
          setDefaulCity($scope.defaultCity);
        }, 100);

      } else {
        setDefaulCity($scope.defaultCity);
      }

    };

    // Runs during compile
    return {
      templateUrl: 'citymenu.html',
      compile: compile,
      scope: {
        checkedcall: '&'
      }
    };
  }
]);
