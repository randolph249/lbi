lbiApp.controller('createMarket.step2Ctrl', ['$scope', '$state', function(
  $scope, $state) {
  $scope.$on('$stateChangeSuccess', function(e, tostate, toparams,
    fromstate, tostate) {

    $scope.startDate = toparams.startdate;
    $scope.endDate = toparams.enddate;

    $scope.crowdcount = toparams.count;
  });

  $scope.datepickeroptions = {};

  //返回上一步
  $scope.back = function() {
    $state.go('index.crowd.step1');
  };

  //
  $scope.createComplete = function() {
    $scope.$emit('PASS_CROWD_PARAMS', {
      crowdName: $scope.crowdName,
      validetime: $scope.curDate
    });
  };
}])
