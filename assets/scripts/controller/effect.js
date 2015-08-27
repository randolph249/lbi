//营销效果分析
lbiApp.controller('effectCtrl', [
  '$scope',
  '$state',
  'SweetAlert',
  'marketActiveList',
  'lbiService',
  function($scope, $state, SweetAlert, marketActiveList, lbiService) {
    //

    var redirectRouter = function(params) {
      //默认跳转到效果分析页面
      if ($state.current.name == 'index.effect') {
        $state.go('index.effect.analy', params);
        return false;
      }
      $state.go($state.current.name, params);
      return false;
    };


    $scope.$on('$stateChangeSuccess', function(e, tostate, toparam,
      fromstate, fromparam) {
      //如果通过导航跳转到营销效果
      //查询投放活动列表
      $scope.naviname = tostate;
    });



    lbiService('getActivitys', {}).then(function(activeList) {
      $scope.activeList = activeList;
      $scope.activeId = activeList[0]['activityid'];

    }, function(msg) {
      SweetAlert.swal({
        title: errorMsg,
        confirmButtonColor: '#399eee',
        confirmButtonText: '确定'
      })
    })


    //监听
    $scope.$watch('activeId', function(activeId) {
      if (!activeId) {
        return false;
      }


      redirectRouter({
        id: activeId
      });

    });



  }
]);
