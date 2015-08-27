//创建营销人群
lbiApp.controller('createMarketCtrl', [
  '$scope',
  '$state',
  'lbiService',
  'SweetAlert',
  'tagEnitySwitch',
  '$timeout',
  function($scope, $state, lbiService, SweetAlert, tagEnitySwitch, $timeout) {
    $scope.inArray = $.inArray;

    var reqParams = {};


    $scope.$on('$stateChangeSuccess', function(e, tostate, toparams,
      fromstate, fromparams) {

      // debugger;
      //如果没有refer
      if (fromstate.name == '') {
        $state.go('index.crowd.step1');
        return false;
      }

      if (tostate.name == 'index.crowd') {
        $state.go('index.crowd.step1');
      }


      // debugger;
      if (tostate.name == 'index.crowd.step1' && !$.isEmptyObject(
          reqParams)) {

        $timeout(function() {
          $scope.$broadcast('BROADCAST_CROWD_PARAMS', $.extend({},
            reqParams));
        }, 100)
      }
    });

    $scope.$on('PASS_CROWD_PARAMS', function(e, params) {
      reqParams = $.extend(reqParams, params);

      if (params.hasOwnProperty('crowdName')) {
        //发送创建营销人群请求
        createCrowd();
      }
    });


    //创建营销人群
    var createCrowd = function() {
      lbiService('createCrowd', $.extend({}, reqParams, {
        tagEntitys: tagEnitySwitch(reqParams.tagEntitys)
      }), 'POST').then(function(info) {
        SweetAlert.swal({
          title: '创建营销人群成功!',
          confirmButtonColor: '#399eee',
          confirmButtonText: '确定'
        }, function(isConfirm) {
          $scope.go('index.crowd.step1');

        });
      }, function(desc, errorcode) {
        SweetAlert.swal({
          title: '创建营销人群失败!',
          text: desc,
          confirmButtonColor: '#399eee',
          confirmButtonText: '确定'
        }, function(isConfirm) {

          $state.go('index.crowd.step1');
        });
      });
    };
  }
]);
