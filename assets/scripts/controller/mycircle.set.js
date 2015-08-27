//设置页面controller
//childcontorller:myCircleList
lbiApp.controller('mySet.circle.addCtrl', [
    '$scope',
    '$state',
    'lbiService',
    'SweetAlert',
    function($scope, $state, lbiService, SweetAlert) {

        //添加商圈
        $scope.$on('$stateChangeSuccess', function() {
            $scope.displayAddcircle = true;
        });


        $scope.addcircle = function(params) {
            lbiService('addCircle', params, 'POST').then(function() {
                SweetAlert.swal({
                    title: '成功添加商圈!',
                    confirmButtonColor: '#399eee',
                    confirmButtonText: '确定'
                }, function(confirm) {
                    $state.go('index.set.circle');

                    //update circle
                });
                return false;
            });
        }

        $scope.cancelcircle = function() {
            $state.go('index.set.circle');
        }

    }
]);
