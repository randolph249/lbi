lbiApp.factory('docmentClickOutSide', ['$rootScope', function($rootScope) {
  $('body').on('click', function(e) {
    var curTarget = $(e.target);
    $rootScope.$broadcast('DOCUMENT_CLICK', curTarget)
  });
  return {};
}]);

//封装下拉菜单
//可定义参数 下拉菜单宽度(width) 字符串长度限制(limitmax)
lbiApp.directive('dropMenu', ['safeApply', '$rootScope', 'docmentClickOutSide',
  function(safeApply, $rootScope, docmentClickOutSide) {
    // Runs during compile
    return {
      scope: {
        cid: '=cid',
        list: '=list',
        model: '=ngModel'
      },
      require: '?ngModel',
      transclude: true,
      templateUrl: 'dropmenu.html',
      compile: function(ele, attr, transcludeFn) {
        return {
          pre: function($scope, iElm, iAttrs) {
            var initCid = $scope.$watch('cid', function(v) {
              //默认传递的cid用string长度校验
              if ($.type(v) == 'undefined' || !String(v).length) {
                return false;
              }
              v = String(v); //强制转化
              getNameById(v);
              // initCid();
            });


            var getNameById = function(id) {
              if (!id || !String(id).length) {
                return false;
              }
              var str = '',
                passname = $scope.passname,
                displaykey = $scope.displaykey;

              $.each($scope.list, function(index, item) {
                if (item[passname] == id) {
                  str = item[displaykey];
                  return false;
                }
              });
              $scope.selectedname = str;
              return false;
            };


            $scope.displaykey = iAttrs.displaykey || "name"; //默认展示被选中数据的name属性
            $scope.searchEnable = iAttrs.searchEnable === 'true' ? true :
              false; //默认不展示搜索功能
            $scope.width = Number(iAttrs.width) || 200;
            $scope.passname = iAttrs.passname || "id"; //默认 传递被选中数据的ID属性
            $scope.selectedname = ""; //展示的选中内容
            $scope.showMe = false;
            $scope.Math = window.Math; //把Math方法挂载到$scope下 否则无法在template下调用
            $scope.prevdis = true; //默认情况禁止翻页
            $scope.nextdis = true; //默认情况禁止翻页
            $scope.prev = function() {
              if ($scope.prevdis) {
                return false;
              }
              $scope.pageno = $scope.pageno - 1;
            };
            $scope.next = function() {
              if ($scope.nextdis) {
                return false;
              }
              $scope.pageno = $scope.pageno + 1;
            };
            $scope.chooseId = function(id) {
              $scope.showMe = false;
              $scope.cid = id;
              getNameById(id); //修改selectedname属性
            };



          },
          post: function($scope, iElm, iAttrs, ngModel) {
            $scope.showTransclude = iElm.find('[ng-transclude]').children()
              .length != 0;

            $scope.$watch('model', function(v) {
              if (!v) {
                return false;
              }
              ngModel && ngModel.$setViewValue(v);
            });

            $scope.$on('DOCUMENT_CLICK', function(e, dom) {
              if ($scope.showMe == false) {
                return false;
              }

              if (!iElm.find(dom).length) {
                safeApply($scope, function() {
                  $scope.showMe = false;

                })
              }
            });

          }
        };
      }
    };
  }
]);

//多选下拉菜单
lbiApp.directive('multipleDropMenu', ['safeApply', function(safeApply) {
  var pre = function($scope, iElm, iAttrs, ngModel) {
    $scope.width = iAttrs.width || 120;
    $scope.showMe = false;
    $scope.passname = iAttrs.passname || 'id';
    $scope.displaykey = iAttrs.displaykey || 'name';
    // 选择提示
    $scope.placeHolder = iAttrs.placeHolder || '请选择'
      //默认允许搜索
    $scope.searchEnable = iAttrs.searchEnable === 'false' ? false :
      true;

    //添加或者删除元素
    $scope.toggleItem = function(id) {
      //调用parent controller
      $scope.toggleCheckedItem({
        items: [id]
      });
    };

    //全选
    $scope.chooseAll = function() {
      var ids = $.map($scope.list, function(item) {
        return item[$scope.passname];
      });
      $scope.toggleCheckedItem({
        items: ids
      });
    };

    $scope.isChecked = function(id) {
      return $scope.checkedList.join(',').indexOf('' + id) != -1;
    };
  };

  var post = function($scope, iElm, iAttrs, ngModel) {
      $scope.$watch('model', function(v) {
        if (!v) {
          return false;
        }
        ngModel && ngModel.$setViewValue(v);
      });

      $scope.$on('DOCUMENT_CLICK', function(e, dom) {
        if ($scope.showMe == false) {
          return false;
        }

        if (!iElm.find(dom).length) {
          safeApply($scope, function() {
            $scope.showMe = false;

          })
        }
      });

    }
    // Runs during compile
  return {
    scope: {
      list: '=',
      checkedList: '=',
      toggleCheckedItem: '&',
      model: '=ngModel'
    }, // {} = isolate, true = child, false/undefined = no change
    require: '?ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    templateUrl: 'multipledropmenu.html',
    transclude: true,
    compile: function(ele, attr) {
      return {
        pre: pre,
        post: post
      }
    }
  };
}]);

lbiApp.directive('multipleDropMenuPage', [function() {
  // Runs during compile
  function pre($scope, iElm, iAttrs) {
    //向前翻页
    $scope.pageNo = 1;
    $scope.prev = function() {
      if ($scope.pageNo == 1) {
        return false;
      }
      $scope.pageNo = $scope.pageNo - 1;
      $scope.pagingAction({
        page: $scope.pageNo
      });
    };
    iAttrs.$observe('pageNo', function(v) {
      if (!v || !Number(v)) {
        return false;
      }
      $scope.pageNo = Number(v);
      $scope.pagingAction({
        page: $scope.pageNo
      });
    });

    //向后翻页
    $scope.next = function() {
      if ($scope.pageNo == $scope.totalPage) {
        return false;
      }
      $scope.pageNo = $scope.pageNo + 1;
      $scope.pagingAction({
        page: $scope.pageNo
      });
    }
  };
  return {
    templateUrl: 'multipledropmenupage.html',
    compile: function() {
      return {
        pre: pre
      }
    },
    scope: {
      totalPage: '=',
      pagingAction: '&'
    }
  };
}]);
