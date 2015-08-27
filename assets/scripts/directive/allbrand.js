// 所有的类目
lbiApp.directive('allbrand', ['lbiService', 'superCat', function(lbiService, superCat) {
    // Runs during compile
    var link = function($scope, iElm, iAttrs) {
        $scope.checked_brand = {};

        $scope.super = [];
        superCat.then(function(list) {
            $scope.super = list;
        });

        //请求一级类目下的品牌 当鼠标停留在一级类目上超过200ms的时候 执行请求
        $scope.getBrandData = (function() {
            var nowId = '';
            return function(id, name) {
                nowId = id;
                setTimeout(function() {
                    if (nowId == id) {
                        $scope.requestBrandData(id, name);
                    }
                }, 200);
            };
        })();
        //发送数据请求
        $scope.requestBrandData = function(id, name) {
            lbiService('get_brands',{
                categoryId: id
            }).then(function(brandlist) {
            	$scope.brandlist=brandlist;
                $.each($scope.brandlist, function(index, item) {
                    item.brandcatname = name;
                    item.brandcatid = id;
                });
            });
        };

        //选择关注品牌
        $scope.chooseBrand = function(item) {
            $scope.checked_brand = item;
        };



        $scope.click_confirm = function() {
            $scope.confirmcall({
                checkedItem: $scope.checked_brand
            })
        }

        $scope.click_cancel = function() {
            $scope.cancelcall();
        }



    }

    return {
        scope: {
            confirmcall: '&confirm',
            cancelcall: '&cancel'
        },
        templateUrl: 'allbrand.html',
        link: link
    };
}]);
