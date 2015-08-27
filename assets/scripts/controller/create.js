var lbiApp = angular.module('lbiApp');
/**
 * [添加商圈和用户类目]
 * @param  {[type]} $scope [description]
 * @return {[type]}        [description]
 */
lbiApp.controller('createMemberInfoCtrl', [
    '$scope',
    'lbiService',
    '$state',
    'SweetAlert',
    function($scope, lbiService, $state, SweetAlert) {
        $scope.step = 1;
        $scope.params = {};


        $scope.checked_cat = {};
        $scope.checked_brand = {};


        //添加商圈confirm
        $scope.addcircle = function(params) {
            $scope.params = $.extend($scope.params, params);
            $scope.step = 2;
        };

        $scope.cancelcircle = function() {};


        //展示类目列表页
        $scope.showCatList = function() {
            $scope.displayCatlist = true;
        };
        //展示品牌列表页
        $scope.showBrandList = function() {
            $scope.displayBrandlist = true;
        };


        //选择关注类目
        $scope.catconfirm = function(item) {
            if (!$.isEmptyObject(item)) {
                $scope.checked_cat = {
                    category_full_name: item.category_full_name,
                    name: item.name,
                    id: item.id
                };

                $scope.params = $.extend($scope.params, {
                    categoryId: item.id
                });
            }
            $scope.displayCatlist = false;
        };

        $scope.catcancel = function() {
            $scope.displayCatlist = false;
        };


        //选择关注品牌
        $scope.brandconfirm = function(item) {
        	if (!$.isEmptyObject(item)) {
                $scope.checked_brand = {
                    brand_full_name: '一级类目~' + item.brandcatname + '>>' + item.brand_name,
                    brandcatid: item.brandcatid,
                    brand_id: item.brand_id,
                    brand_name: item.brand_name
                };

                $scope.params = $.extend($scope.params, {
                    brandId: item.brand_id,
                    brandcatid: item.brandcatid
                });
            }
            $scope.displayBrandlist = false;
        };

        $scope.brandcancel = function() {
            $scope.displayBrandlist = false;
        };

        $scope.confirmcatandbrand = function() {
            $scope.step = 3;
        };

        $scope.completeSet = function() {
            lbiService('addBaseInfo', $scope.params, 'POST').then(redirectToNormal);
        };



        //跳转到normal page
        function redirectToNormal() {
            SweetAlert.swal({
                title: '设置完成!',
                confirmButtonColor: '#399eee',
                confirmButtonText: '确定'
            }, function(confirm) {
                $state.go('index.normal');
            });
        }
    }
]);
