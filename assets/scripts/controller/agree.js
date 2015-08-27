lbiApp.controller('agreeCtrl', [
  '$scope',
  'lbiService',
  '$state',
  'SweetAlert',
  function($scope, lbiService, $state, SweetAlert) {
    $scope.sign_agreement = function() {
      lbiService('sign_agreement', {}, 'POST').then(function() {
        SweetAlert.swal({
          title: '成功签订协议!',
          confirmButtonColor: '#399eee',
          confirmButtonText: '确定'
        }, function(confirm) {
          $state.go('index.normal');
        });
      });
    };
  }
]);
