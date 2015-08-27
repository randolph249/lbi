/**
 *网格图图例
 *后台获取网格图
 **/

lbiApp.directive('tilelegend', [function() {
  var pre = function($scope, iAttrs, iElm) {
      $scope.Number=Number;
      $scope.selected = [];
      $scope.toggleItem = function(item) {
        var str = item.min + ',' + item.max,
          isite = $.inArray(str, $scope.selected);

        if (isite == -1) {
          $scope.selected.push(str);
        } else {
          selected = $scope.selected.splice(isite, 1);
        }

        $scope.selectCall && $scope.selectCall({
          selected: $scope.selected
        });
      };

      $scope.isChecked = function(item) {
        var str = item.min + ',' + item.max;
        return $.inArray(str, $scope.selected) != -1;
      };


      //监听legends变化
      $scope.$watch('legends', function(legends) {

        if (!legends || !legends.length) {
          return false;
        }

        //默认全选
        $scope.selected = $.map(legends, function(item) {
          return item.min + ',' + item.max;
        });

        $scope.selectCall && $scope.selectCall({
          selected: $scope.selected
        });

      });
    };
  return {
    templateUrl: 'tilelegend.html',
    compile: function(iElm, iAttrs) {
      return {
        pre: pre
      }
    },
    scope: {
      legends: '=',
      selectCall: '&'
    }
  }
}]);
