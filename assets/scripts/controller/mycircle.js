//设置页面controller
//childcontorller:myCircleList
lbiApp.controller('mySet.circleCtrl', [
    '$scope',
    '$state',
    'lbiService',
    'SweetAlert',
    function($scope, $state, lbiService, SweetAlert) {


        //当当前URL为set.circle的时候重新商圈
        $scope.$on('$stateChangeSuccess', function(e, tostate, toparam) {
            //默认请求第一页数据
            var page = toparam.page || 1;

            if (tostate.name == 'index.set.circle') {
                requestCircleList(page);
            }
        });

        $scope.cancelcircle = function() {
            $scope.displayAddcircle = false;
        }

        $scope.showAddCircle = function() {
            $state.go('index.set.circle.add');
            $scope.displayAddcircle = true;
        }

        //绑定翻页插件的回调函数
        $scope.paging = function(text, page) {
            $scope.pageNo = page;

            $state.go('index.set.circle', {
                page: page
            });
        };

        //请求商圈列表function
        function requestCircleList(page) {
            lbiService('circleList', {
                pageNo: page
            }).then(function(info) {
                $scope.circlelist = info[0].bizAreaInfo;
                $scope.pageNo = info[0].pageNo;
                $scope.totalCount = info[0].totalCount;
                $scope.pageSize = 10;
            });
        };



        //删除某个商圈
        $scope.delItem = function(item, index) {

            SweetAlert.swal({
                title: '确定删除?',
                text: '确定要删除商圈:' + item.name,
                showCancelButton: true,
                confirmButtonColor: '#399eee',
                confirmButtonText: '确定',
                cancelButtonColor: '#f5f5f5',
                cancelButtonText: '取消'
            }, function(isConfirm) {
                if (isConfirm) {
                    lbiService('delCircle', {
                        id: item.id
                    }, 'POST').then(function() {});
                }
            });
        };
    }
]);
