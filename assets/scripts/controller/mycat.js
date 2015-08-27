// 设置页面controller
//childcontorller:myCircleList/addCircleCtrl/myCatBrandCtrl
lbiApp.controller('mySet.catCtrl', [
    '$scope',
    'myCatResource',
    'myBrandResource',
    function($scope, myCatResource, myBrandResource) {
        //默认情况下 category brand addcircle 页面不显示


        //更新用户关注类目
        function updateCat(categoryId) {
            myCatResource.update({
                categoryId: categoryId
            });
            // favCatAndBrand.set('cat', {
            //     categoryId: categoryId
            // });
        }

        //更新用户关注品牌
        function updateBrand(categoryid, brandid) {
            myBrandResource.update({
                categoryid: categoryid,
                brandid: brandid
            });
            // favCatAndBrand.set('brand', {
            //     categoryid: categoryid,
            //     brandid: brandid
            // });
        }


        // 获取用户关注类目
        myCatResource.query().then(function(data) {
            $scope.myCats = {
                category_full_name: data[0].category_full_name,
                name: data[0].name,
                id: data[0].id
            };
        })
        

        //获取用户关注的品牌
        myBrandResource.query().then(function(data){
            $scope.myBrands = {
                brand_full_name: data[0].brand_full_name,
                brandcatid: data[0].category_id,
                brand_id: data[0].brand_id,
                brand_name: data[0].brand_name
            };
        });

        //调出商品类目列表页
        $scope.showCatList = function() {
            //判断一级类目是否获取到
            $scope.displayCatlist = true;
        };


        //调出商品品牌页
        $scope.showBrandList = function() {
            $scope.displayBrandlist = true;
        };

        $scope.catconfirm = function(item) {
            if (!$.isEmptyObject(item)) {
                $scope.myCats = {
                    category_full_name: item.category_full_name,
                    name: item.name,
                    id: item.id
                }
                updateCat(item.id);
            }
            $scope.displayCatlist = false;
        }
        $scope.catcancel = function() {
            $scope.displayCatlist = false;
        }

        $scope.brandconfirm = function(item) {
            $scope.myBrands = {
                brand_full_name: '一级类目~' + item.brandcatname + '>>' + item.brand_name,
                brandcatid: item.brandcatid,
                brand_id: item.brand_id,
                brand_name: item.brand_name
            };
            $scope.displayBrandlist = false;
            updateBrand(item.brandcatid, item.brand_id);
            //
        };
        $scope.brandcancel = function() {
            $scope.displayBrandlist = false;
        }
    }
]);
