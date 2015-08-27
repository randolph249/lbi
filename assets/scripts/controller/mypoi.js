lbiApp.controller('mySet.poiCtrl', [
    '$scope',
    'myPoiResource',
    'SweetAlert',
    'queryPlaceBySearchPoi',
    function($scope, myPoiResource, SweetAlert, queryPlaceBySearchPoi) {

        //接受当前城市xin'x
        $scope.checkcity = function(poi) {
            $scope.cityname = poi.cityname;
            $scope.citycode = poi.citycode;
            $scope.citylnglat = {
                lng: poi.x,
                lat: poi.y
            };
        };

        //获取用户当前关注的POi 
        $scope.pois = [];
        myPoiResource.query().then(function(info) {
            // 如果用户没有选择兴趣点
            //直接点开编辑界面
            if (!info.length) {
                $scope.displayPoiEdit = true;
            }
            $scope.pois = info;
            $scope.curPoi = info[0].type;
        });


        //监听当前poi和当前城市信息
        //当发生改变你的时候 请求麻点图 
        $scope.$watch('curPoi+citycode', function() {
            if (!$scope.citycode || !$scope.curPoi) {
                return false;
            }
            $scope.layerkeyword = $.grep($scope.pois, function(item) {
                return item.type == $scope.curPoi
            })[0].desc;

            // 获取当前城市下POI的大概数值
            queryPlaceBySearchPoi({
                city: $scope.citycode,
                type: $scope.curPoi,
                key: $scope.layerkeyword
            }).then(function(results) {
                $scope.aboutPoiCount = results.count;
            }, function() {
                $scope.aboutPoiCount = 0;
            });
        });

        //打开编辑界面的时候 传递一被选中POI 信息
        $scope.openEditInterface = function() {
            $scope.displayPoiEdit = true;
            $scope.$broadcast('UPDATE_CHECKED_POIS', $scope.pois);

        };

        // 删除POI 
        $scope.delPoi = function(item, index) {
            SweetAlert.swal({
                title: '确定删除兴趣点' + item.desc + '?',
                confirmButtonText: '确定',
                confirmButtonColor: '#399eee',
                cancelButtonText: '取消',
                cancelButtonColor: '#f0f0f0',
                showCancelButton: true
            }, function() {
                $scope.pois.splice(index, 1);
                myPoiResource.del({
                    type: item.type
                });
                resetCurpoi();
            })
        }

        $scope.$on('UPDATE_MY_POIS', function(e, pois) {
            $scope.pois = pois;
            $scope.displayPoiEdit = false;
            resetCurpoi();
        });

        $scope.$on('CANCEL_EDIT_MY_POIS', function() {
            $scope.displayPoiEdit = false;
        });


        //当重置当前选中POI
        var resetCurpoi = function() {
            var grepLen = $.grep($scope.pois, function(item) {
                return item.type == $scope.curPoi;
            });
            if(!grepLen.length){
                $scope.curPoi=$scope.pois[0].type;
            }
        };
    }
]);

lbiApp.controller('mySet.poi.editCtrl', [
    '$scope',
    'myPoiResource',
    'lbiService',
    function($scope, myPoiResource, lbiService) {
        $scope.pois = [];

        $scope.$on('UPDATE_CHECKED_POIS', function(e, pois) {
            $scope.pois = pois;
        });

        //判断添加元素是否已经在选中的POI点里面了
        var judgeExitInPois = function(checkedType) {
            return $.grep($scope.pois, function(item) {
                return item.type == checkedType;
            }).length;
        }

        //删除POI点
        $scope.delPoi = function(item, index) {
            $scope.pois.splice(index, 1);
            myPoiResource.del({
                type: item.type
            });
        };

        //热门推荐POI列表
        $scope.hotPois = {};
        lbiService('recommendPois').then(function(info) {
            $scope.hotPois = info[0];
        });


        // POI 点搜索提示
        $scope.typeahead = {
            datasets: {
                source: function(q, cb) {
                    lbiService('searchPois', {
                        desc: q
                    }).then(function(pois) {
                        //限制15条
                        cb(pois.splice(0, 15));
                    });
                },
                templates: {
                    empty: ['<div class="search-empty">', '没有找到相关的POI信息', '</div>'].join('\n'),
                    suggestion: Handlebars.compile([
                        '<div class="search-result">',
                        '<p class="search-result-poiname">',
                        '{{level3}}',
                        '<i class="iconfont icon-check"></i>',
                        '</p>',
                        '</div>'
                    ].join(''))
                }
            },
            options: {
                highlight: true
            }
        };


        $scope.$on('typeahead:selected', function(e, poi) {
            addPoi(poi);
        })

        //从热门推荐里面选择一个POI 点
        $scope.selectHotpoi = function(item) {
            addPoi(item)
        };


        var addPoi = function(item) {
            if (judgeExitInPois(item.type)) {
                return false;
            }
            $scope.pois.push({
                desc: item.level3,
                type: item.type
            });

            //后台添加请求
            myPoiResource.add({
                type: item.type
            });
        }

        //点击确定按钮
        $scope.confirmEdit = function() {
            $scope.$emit('UPDATE_MY_POIS', $scope.pois);
        };
        //点击取消按钮
        $scope.cancelEdit = function() {
            $scope.$emit('CANCEL_EDIT_MY_POIS');
        };

    }
])
