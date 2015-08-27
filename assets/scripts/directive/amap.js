/**
 *所有和地图相关的directive
 *所有的amap** directive 都要调用ngModel 方便调用mapObj对象
 *mapObj对象有amap directive创建 其他的amap** directive 调用
 **/



//amap地图基础directive
//包括地图初始化
//监听地图中心点坐标变化 商圈半径大小
lbiApp.directive('amap', ['safeApply', function(safeApply) {
    return {
        require: 'ngModel',
        link: function($scope, iElm, iAttrs, ngModel) {
            var func = arguments.callee,
                init_offset = iElm.offset();

            //因为初始化的时候 地图容器的offset.left和top都是0 所以地图会有偏移
            //这个时候要监听容器的offset 只有地图容器正常偏移的时候 才能执行地图加载
            if (init_offset.left == 0 || init_offset.right == 0) {
                setTimeout(function() {
                    func.call(window, $scope, iElm, iAttrs, ngModel);
                }, 20);
                return false;
            }

            var mapObj,
                options = iAttrs.mapoptions,
                mapOption = {
                    scrollWheel: false,
                    center: new AMap.LngLat(116.368904, 39.913423)
                },
                ele = iElm[0];

            mapObj = new AMap.Map(ele, mapOption);
            mapObj.setZoom(13);


            //加载刻度尺
            mapObj.plugin(['AMap.OverView', 'AMap.ToolBar'], function() {

                var view = new AMap.OverView({
                    visible: false
                });
                mapObj.addControl(view);
                var tool = new AMap.ToolBar();
                mapObj.addControl(tool);
            });

            //监听当前pois中心点
            iAttrs.$observe('center', function() {
                var lnglat = $scope.center;
                if ($.type(lnglat) === 'string' && /^\[.+\]$/.test(lnglat)) {
                    lnglat = eval('{' + lnglat + '}');
                }

                if (!lnglat || !lnglat.length) {
                    return false;
                }
                mapObj.setCenter(new AMap.LngLat(lnglat[0], lnglat[1]));
            });

            //改变mapObj 允许其他amap** directive 使用

            safeApply($scope, function() {
                ngModel.$setViewValue(mapObj);
            });

            iAttrs.$observe('bound', function(b) {
                if ($.type(b) == 'undefined' || b.length == 0) {
                    return false;
                }
                try {
                    b = JSON.parse(b);
                    var bounds = new AMap.Bounds(b.southwest, b.northeast);
                    mapObj.setBounds(bounds);
                } catch (e) {

                }
            });
        }
    };
}]);


//绘制覆盖面
//现在覆盖面有两种类型:circle and polygon
//当类型是polygon的时候 获取坐标集合 绘制多边形
lbiApp.directive('amapdrawcover', function() {

    var drawCover = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue;

        if ($.type(mapObj) !== 'object') {
            setTimeout(function() {
                drawCover($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        }

        var cover,
            coverType,
            drawCircle = function(lnglat, radius, options) {
                cover = new AMap.Circle(
                    $.extend({
                        center: new AMap.LngLat(lnglat[0], lnglat[1]),
                        radius: Number(radius)
                    }, options)
                );
                cover.setMap(mapObj);
                //选择合适的缩放级别
                mapObj.setFitView([cover]);
            },
            drawPolygon = function(polygonArr, options) {
                //polygon数据格式为["116.403322 39.920255","116.403322 39.920255",...]
                var paths = [];
                $.each(polygonArr, function(index, item) {
                    var polygon = item.split(' ');
                    paths.push(
                        new AMap.LngLat(polygon[0], polygon[1])
                    );
                });

                cover = new AMap.Polygon(
                    $.extend({
                        path: paths
                    }, options)
                );
                cover.setMap(mapObj);
                // 选择合适的缩放级别
                mapObj.setFitView([cover]);

            }; //覆盖面
        //判断用户有传递入wkt坐标集合  如果有认为是polygon 否则就认为是circle

        iAttrs.$observe('coverObj', function(coverObj) {
            if (!coverObj) {
                return false;
            }
            coverObj = JSON.parse(coverObj);

            // 如果coverObj没有中心点 || 中心点 ||中心点length
            if (!coverObj.hasOwnProperty('center') || !coverObj.center || !coverObj
                .center.length) {
                return false;
            }

            //判断覆盖面类型
            if (!coverObj.hasOwnProperty('wkt') || !coverObj.wkt || !coverObj.wkt.length) {
                coverType = 'circle';
            } else {
                coverType = 'polygon';
            }

            //删除旧的的cover
            cover && cover.setMap(null);
            cover = undefined;

            var center = coverObj.center,
                wkt = coverObj.wkt,
                radius = coverObj.radius,
                options = $.extend({
                    zIndex: 2,
                    strokeColor: "#0000FF", //线颜色
                    strokeOpacity: 0.8, //线透明度
                    strokeWeight: 3, //线粗细度
                    fillColor: "#ee2200", //填充颜色
                    fillOpacity: 0.2 //填充透明度
                }, coverObj.options);

            if (coverType == 'circle') {
                drawCircle(center, radius, options);
            }

            if (coverType == 'polygon') {
                drawPolygon(wkt, options);
            }


        });
    }

    return {
        require: '^?ngModel',
        link: drawCover
    };
});

//根据关键词提供POI地点搜索
//依赖于amap directive。和directive共享一个mapObj实例
lbiApp.directive('amapsearch', [function() {
    var placesearch = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue,
            city = iAttrs.city; //当前城市

        //如果mapObj没有被实例化
        if ($.type(mapObj) !== "object") {
            setTimeout(function() {
                placesearch($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        }

        var MSearch,
            //发送数据更新请求
            updateDataRequest = function(key) {
                if (!key.length) {
                    return false;
                }
                $.type(MSearch) == "object" && MSearch.search(key);
            },
            //获取POI列表响应数据;
            //当数据请求成功以后 发送广播
            getDataSource = function(res) {

                var datasource = [];
                if (res.info == "OK") {
                    datasource = res.poiList.pois;
                }
                $scope.$emit('UPDATE_DATASOURCE', datasource);
            };

        //加载搜索插件
        mapObj.plugin(['AMap.PlaceSearch'], function() {
            MSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 10,
                pageIndex: 1,
                extensions: 'all',
                city: city
            });
            AMap.event.addListener(MSearch, "complete", getDataSource);
        });

        //监听当前用户城市 城市更新 更新MSearch class 如果用户配置了搜索城市功能
        iAttrs.$observe('city', function(city) {
            $.type(MSearch) == "object" && MSearch.setCity(city);
        });


        //假如配置了 placesearch功能
        //监听poiname变化 当poiname变更 请求poi列表信息（搜索提示数据）
        iAttrs.$observe('searchkey', function(searchkey) {
            if (!searchkey) {
                return false;
            }
            updateDataRequest(searchkey);
        });
    };

    return {
        terminal: true,
        require: '^?ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: placesearch
    };
}]);

//绘制麻点图
lbiApp.directive('amapicons', ['safeApply', function(safeApply) {

    var drawIcons = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue;

        //如果mapObj没有被实例化
        if ($.type(mapObj) !== 'object') {
            setTimeout(function() {
                drawIcons($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        }

        //鼠标移上ICON
        var icons = [],
            size = Number(iAttrs.iconsize) || 10,
            mouseovericon = iAttrs.mouseovericon,
            isFitView=iAttrs.isFitView=='true'?true:false,
            //鼠标离开ICON
            mouseouticon = iAttrs.mouseouticon,
            //预加载图片
            preloadImage = function(url) {
                var image = $("<img/>").attr("src", url);
            },
            //绘制mark图
            drawMarks = function(pois) {
                //删除旧的icon
                $.each(icons, function(index, icon) {
                    icon.setMap(null);
                });
                icons = [];
                var paths = [];

                var limit = iAttrs.limit || 1,
                    tipMark;

                //绘制新的icon

                $.each(pois, function(index, poi) {
                    var lnglat = new AMap.LngLat(poi.x, poi.y);
                    paths.push(lnglat);
                    var icon = new AMap.Marker({
                        zIndex: 110,
                        position: lnglat, //基点位置
                    });
                    var iconContent = document.createElement('div');

                    iconContent.textContent = iAttrs.icontext || (index + 1);

                    iconContent.className = iAttrs.iconclass || 'amapicon-normal';
                    var tiptext = iAttrs.tipkey && poi[iAttrs.tipkey];
                    var tipclass = iAttrs.tipclass || 'icontip'
                    icon.setContent(iconContent);

                    AMap.event.addListener(icon, 'click', function(e) {
                        $scope.iconClick && safeApply($scope, function() {
                            $scope.iconClick({
                                poi: poi
                            });
                        })
                    });

                    tiptext && AMap.event.addListener(icon, 'mouseover', function(e) {
                        tipMark = new AMap.Marker({
                            position: lnglat,
                            offset: new AMap.Pixel(-24, -60),
                            content: '<p class="' + tipclass + '">' + tiptext + '</p>'
                        });
                        tipMark.setMap(mapObj);
                    });

                    tiptext && AMap.event.addListener(icon, 'mouseout', function(e) {
                        tipMark && tipMark.setMap(null);
                        tipMark = null;
                    });

                    // icon.setTitle(poi.name);
                    icon.setMap(mapObj);
                    //统一由icons管理
                    icons.push(icon);


                });

                //保持所有的icons在科室范围
                if (isFitView) {
                    var cover = new AMap.Polygon({
                        path: paths
                    });

                    mapObj.setFitView([cover]);
                }
            };


        //监听DOM是否有marklnglats属性 && marklnglats.type=="array"
        //绘制icon图
        iAttrs.$observe("marklnglats", function(icons) {
            if (icons == "") {
                return false;
            }

            if ($.type(JSON.parse(icons)) !== 'array') {
                return false;
            }
            drawMarks(JSON.parse(icons));
        });

        //监听icon 文案变化
        iAttrs.$observe("icontext", function(icontext) {
            if (!icons || !icons.length) {
                return false;
            }
            if (!icontext || !icontext.length) {
                return false;
            }

            $.each(icons, function(index, icon) {
                var content = icon.getContent();
                content.textContent = icontext;
                icon.setContent(content);
            });
        })
    };

    return {
        terminal: true,
        scope: {
            iconClick: '&'
        },
        require: '^?ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: drawIcons
    };
}]);

lbiApp.directive('amapcovers', ['safeApply', function(safeApply) {

    var drawCovers = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue;

        //如果mapObj没有被实例化
        if ($.type(mapObj) !== 'object') {
            setTimeout(function() {
                drawCovers($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        }

        //缓存所有的商圈
        var covers = [],
            pois = [],
            normalOptions = {
                strokeWeight: 2,
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                fillColor: '#CCF3FF',
                fillOpacity: 0.2
            },
            curOptions = {
                strokeColor: '#ef341c',
                fillOpacity: 0.8,
                strokeWeight: 3,
                strokeOpacity: 1
            },
            orginPolygon,
            limit = iAttrs.limit || 1,
            isFitView = iAttrs.isFitView == "false" ? false : true,
            //获取一个矩形的中心点
            //params lnglats={southWest:LngLat, northEast:LngLat}
            drawItemPolygon = function(index, poi) {
                var cover,
                    paths = [];

                // 绘制多边形
                if (poi.hasOwnProperty('wkt') && poi.wkt.length) {

                    $.each(poi.wkt, function(i, path) {
                        var lnglat = path.split(' ');
                        paths.push(new AMap.LngLat(lnglat[0], lnglat[1]));
                    });

                    cover = new AMap.Polygon($.extend({
                        path: paths
                    }, normalOptions));

                    // 绘制圆形
                } else {
                    cover = new AMap.Circle(
                        $.extend({
                            center: new AMap.LngLat(poi.lng, poi.lat),
                            radius: Number(poi.radius)
                        }, normalOptions)
                    );
                }

                cover.setExtData(poi);

                AMap.event.addListener(cover, "mouseover", function(e) {
                    safeApply($scope, function() {
                        $scope.updatedCover && $scope.updatedCover({
                            poi: poi,
                            index: index
                        });
                    });
                });
                AMap.event.addListener(cover, "mouseout", function(e) {
                    safeApply($scope, function() {
                        $scope.updatedCover && $scope.updatedCover({
                            poi: {},
                            index: -1
                        });
                    });
                })
                cover.setMap(mapObj);
                covers.push(cover);
            },
            //绘制mark图
            draw = function(pois) {
                //删除旧的多边形
                $.each(covers, function(index, cover) {
                    cover.setMap(null);
                });
                covers = [];

                //绘制新的多边形
                $.each(pois, drawItemPolygon);
                isFitView && mapObj.setFitView(covers);
            };

        //监听DOM是否有marklnglats属性 && marklnglats.type=="array"
        //绘制多边形集合图
        iAttrs.$observe("covers", function(p) {

            if (p == "") {
                return false;
            }

            if (!JSON.parse(p) || $.type(JSON.parse(p)) !== 'array') {
                return false;
            }

            pois = JSON.parse(p);


            //绘制icon
            draw(pois);
        });

        //监听zoom 放大某个polygon
        iAttrs.$observe('zoom', (function() {
            var curZoomIndex;
            return function(zoomIndex) {
                if (isNaN(zoomIndex) || !covers[zoomIndex] || curZoomIndex ==
                    zoomIndex) {
                    return false;
                }

                covers[curZoomIndex] && covers[curZoomIndex].setOptions({
                    zIndex: 10,
                    strokeColor: '#0000FF',
                    fillOpacity: '0.2'
                });

                curZoomIndex = zoomIndex;

                covers[curZoomIndex].setOptions({
                        zIndex: 11,
                        strokeColor: '#ff0000',
                        fillOpacity: '0.5'
                    })
                    //获取该区域的中心点
                var centerlnglat = covers[curZoomIndex].getBounds().getCenter();
                mapObj.setCenter(centerlnglat);
                //根据对应的覆盖物选择合适的缩放级别
                mapObj.setFitView([covers[curZoomIndex]]);

                $scope.zoomEnd && $scope.zoomEnd({
                    item: covers[curZoomIndex].getExtData(),
                    bound: covers[curZoomIndex].getBounds()
                });
            }
        })());

    };

    return {
        require: '^?ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: drawCovers,
        scope: {
            updatedCover: '&',
            zoomEnd: '&'
        }
    };
}]);

//绘制瓦片图
lbiApp.directive('amaptile', ['$timeout', function($timeout) {
    var drawtile = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue,
            city = iAttrs.city,
            tileLayer; //当前城市

        //如果mapObj没有被实例化
        if ($.type(mapObj) !== "object") {
            setTimeout(function() {
                drawtile($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        };

        //监听是否存在tileParams参数
        $scope.$watch("tileParams", function(params) {
            if (!params || $.type(params) != 'object' || $.isEmptyObject(params)) {
                return false;
            }

            var tileSize = Number(iAttrs.tileSize);

            //参数转化为JSON;
            //删除旧的tileLayer
            tileLayer && tileLayer.setMap(null);
            tileLayer = undefined;

            //绘制瓦片
            if (!$.isEmptyObject(params)) {
                tileLayer = new AMap.TileLayer({
                    tileSize: 256,
                    zIndex:110,
                    getTileUrl: function(x, y, z) {
                        return html5Draw(x, y, z, params.gids.split(','), params.bound,
                            tileSize, params.legend);
                    }
                });
                tileLayer.setOpacity(0.8);
                tileLayer.setMap(mapObj);
            }
        });
    };

    return {
        require: '^?ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: drawtile,
        scope: {
            tileParams: '='
        }
    };
}]);


lbiApp.directive('amapPlacelayer', [function() {

    var link = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue;

        //如果mapObj没有被实例化
        if ($.type(mapObj) !== 'object') {
            setTimeout(function() {
                link($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        }

        // //地图禁止放大 静止拖动
        // mapObj.setStatus({
        // 	dragEnable: false
        // });

        //删除所有的插件
        // $.each(mapObj.get('controls').Ib, function(index, item) {
        // 	if ($.type(item) == 'object') {
        // 		mapObj.removeControl(item);
        // 	}
        // });

        mapObj.plugin('AMap.PlaceSearchLayer', function() {

            var searchLayer = new AMap.PlaceSearchLayer({
                key: ''
            });

            iAttrs.$observe('lnglat', function(lnglat) {
                if (!lnglat) {
                    return false;
                }
                lnglat = JSON.parse(lnglat);
                var lnglat = new AMap.LngLat(lnglat.lng, lnglat.lat);
                mapObj.setCenter(lnglat);

            });
            iAttrs.$observe('searchkey', function(v) {
                mapObj.setStatus({
                    zoomEnable: true
                });
                if (!v) {
                    return false;
                }
                // //删除旧的麻点图
                searchLayer.setMap(null);
                searchLayer.setKeywords(v);
                searchLayer.setMap(mapObj);
            });

            AMap.event.addListener(searchLayer, 'complete', function(data) {
                mapObj.setZoom(11);
                // mapObj.setStatus({
                // 	zoomEnable: false
                // });
            });
        });

    }

    return {
        require: '^?ngModel',
        link: link
    }
}]);

//绘制区县图
lbiApp.directive('amapAreaRank', ['safeApply', 'tileLegend', function(safeApply,
    tileLegend) {

    var colors = ['#f05b6b', '#fcaf52', '#b1ce24', '#dddddd'];
    var checkedColor = ['#ffffff'];

    var link = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue;

        //如果mapObj没有被实例化
        if ($.type(mapObj) !== 'object') {
            setTimeout(function() {
                link($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        }

        //绘制去区县地图
        var covers = [],
            options = {
                strokeWeight: 1,
                strokeColor: '#ffffff',
                strokeOpacity: 0.8,
                fillOpacity: 0.9
            },
            curid,
            totalBounds,
            lastCheckedid,
            lastClickIndex,
            lastHoverIndex = -1,
            tip,
            idkey = iAttrs.idkey || 'id',
            namekey = iAttrs.namekey || 'name',
            countkey = iAttrs.namekey || 'count',
            rankLegend,
            updateEnabled = iAttrs.updateEnabled == "false" ? false : true,
            clickEnabled = iAttrs.clickEnabled === "false" ? false : true,
            isFitView = iAttrs.isFitView == "false" ? false : true,
            checkColor = function(legends, count) {
                var color = colors[3];
                count = Number(count);
                $.each(legends, function(index, item) {
                    if (Math.max(item.max, count) == item.max && Math.min(item.min,
                            count) == item.min) {
                        color = item.color;
                        return false;
                    }
                });
                return color;
            },
            checkedItem = function(index) {
                if (covers[lastClickIndex]) {
                    covers[lastClickIndex].setOptions({
                        fillColor: covers[lastClickIndex].getExtData()['color'],
                        fillOpacity: 0.9,
                        strokeColor: '#ffffff',
                        zIndex: 10
                    });
                }

                lastClickIndex = index;
                lastCheckedid = covers[index].getExtData()['id'];
                mapObj.setFitView([covers[index]]);

                var attrs = covers[index].getExtData();
                covers[index].setOptions({
                    fillColor: '#ffffff',
                    fillOpacity: 0.8,
                    strokeColor: '#f00'
                });


                $scope.showItemCounty && $scope.showItemCounty({
                    bound: covers[index].getBounds(),
                    info: attrs
                });
            },
            draw = function(index, item) {
                var color = checkColor(rankLegend, item[countkey]),
                    paths = [],
                    marker_distribute,
                    cover,
                    center;

                $.each(item.wkt, function(index, item) {
                    var lnglats = item.split(' ');
                    paths.push(new AMap.LngLat(lnglats[0], lnglats[1]));
                });


                cover = new AMap.Polygon($.extend({}, options, {
                    fillColor: color,
                    path: paths
                }));
                cover.setMap(mapObj);
                covers.push(cover)


                center = cover.getBounds().getCenter();



                //区县名称
                marker_distribute = new AMap.Marker({
                    position: center,
                    offset: new AMap.Pixel(0, -9),
                    content: '<p class="district_name">' + item.name + '</p>'
                });
                marker_distribute.setMap(mapObj);

                cover.setExtData({
                    name: item[namekey],
                    id: item[idkey],
                    count: item[countkey],
                    color: color,
                    marker: marker_distribute
                });


                AMap.event.addListener(cover, 'click', function(e) {
                    if (clickEnabled) {
                        checkedItem(index);
                    }
                });

                AMap.event.addListener(cover, 'mouseover', function(e) {
                    var count;
                    if (isNaN(item[countkey]) || Number(item[countkey]) <= 150) {
                        count = "少量";
                    } else {
                        count = "约" + item[countkey] + '人';
                    }

                    tip = new AMap.Marker({
                        position: center,
                        offset: new AMap.Pixel(-24, -60),
                        content: '<p class="district_count">' + item[namekey] + '人口数:' +
                            count + '</p>'
                    });
                    tip.setMap(mapObj);
                    tip.setTop(true);

                    //marker_distribute.hide();
                });

                AMap.event.addListener(cover, 'mouseout', function(e) {
                    tip && tip.setMap(null);
                    tip = undefined;

                    marker_distribute.show();
                });

                // AMap.event.addListener(marker_distribute, 'mouseover', function(e) {
                // 	marker_distribute.hide();
                // });


            }

        //监听现有的区域列表排名
        $scope.$watch('rank', function(rank) {
            if ($.type(rank) !== 'array') {
                return false;
            }

            //获取legend
            if (rank.length != 0) {
                rankLegend = JSON.parse(iAttrs.rankLegend);
            }


            var isCoordupdate = true;
            //判断城市面坐标是否更新了
            $.each($scope.rank, function(index, item) {
                //如果城市坐标面数据没有改变 不需要重新绘制区县面数据
                if (item[idkey] == curid) {
                    isCoordupdate = false;
                    return false;
                }
            });


            // 如果城市坐标面没有更新 并且用户允许只更新不属性 不执行重绘(updateEnable)
            if (!isCoordupdate && updateEnabled) {

                //获取当前正在操作的子元素（商圈 区县）
                var lastCheckedIndex = -1;
                $.each(rank, function(index, item) {
                    var color = checkColor(rankLegend, item[countkey]);
                    covers[index].setExtData({
                        name: item[namekey],
                        id: item[idkey],
                        count: item[countkey],
                        color: color,
                        marker: covers[index].getExtData()['marker']
                    });

                    covers[index].setOptions({
                        fillColor: color
                    })

                    if (item[idkey] == lastCheckedid) {
                        lastCheckedIndex = index;
                    }
                });

                //城市面属性更新以后
                //根据用户上次点击结果 通知controller
                if (lastCheckedIndex !== -1) {
                    $scope.showItemCounty && $scope.showItemCounty({
                        bound: covers[lastCheckedIndex].getBounds(),
                        info: covers[lastCheckedIndex].getExtData()
                    });

                    checkedItem(lastCheckedIndex);
                }
                // 执行重绘
            } else {

                // 清空原polygon marker
                $.each(covers, function(index, item) {
                    item.getExtData()['marker'].setMap(null);
                    item.setMap(null);
                });
                covers = [];

                // 如果list为空 删除一切操作记录
                if (rank.length == 0) {
                    mapObj.clearMap();
                    lastCheckedid = undefined;
                    lastClickIndex = undefined;
                    curid = undefined;
                    return false;
                }



                // 执行重绘
                $.each(rank, function(index, item) {
                    draw(index, item);
                });

                // 默认第一个区县adcode
                curid = rank[0][idkey];


                var totalPaths = [];
                //获取总区域边界
                $.each(covers, function(index, item) {
                    totalPaths = totalPaths.concat(item.getPath());
                });
                var totalPolygon = new AMap.Polygon({
                    path: totalPaths
                });

                totalBounds = totalPolygon.getBounds();

                mapObj.setFitView(covers);
            }


        });

        //监听外部放大区域index
        //根据放大区域 通知用户
        iAttrs.$observe('zoom', function(zoom) {
            if (isNaN(zoom) || !covers[zoom]) {
                return false
            }

            checkedItem(Number(zoom));
        });

        iAttrs.$observe('zoomvalue', function(zoomvalue) {

            if (!$scope.rank || !$scope.rank.length) {
                return false;
            }

            var zoomkey = iAttrs.zoomkey || 'name',
                $index;

            $.each($scope.rank, function(index, item) {
                if (item[zoomkey] == zoomvalue) {
                    $index = index;
                }
            });

            !isNaN($index) && checkedItem($index);

        })


        // 监听地图缩放事件
        // 如果处于完全可视的级别
        var distance_subtr = false;
        AMap.event.addListener(mapObj, 'zoomend', function() {
            if (!$scope.rank || !$scope.rank.length || $scope.rank.length !=
                covers.length) {
                return false;
            }


            //判断如果区域实际在地图上像素面积过小 只显示一个index的mark
            //else 显示地图区域的name
            $.each(covers, function(index, item) {

                var cover_bound = item.getBounds(),
                    extData = item.getExtData(),
                    marker = extData['marker'],
                    cover_north = cover_bound.getNorthEast(),
                    cover_south = cover_bound.getSouthWest(),
                    cover_pixel_north_east = mapObj.lnglatToPixel(cover_north),
                    cover_pixel_south_west = mapObj.lnglatToPixel(cover_south),
                    pixel_x = Math.abs(cover_pixel_north_east.x -
                        cover_pixel_south_west.x),
                    pixel_y = Math.abs(cover_pixel_north_east.y -
                        cover_pixel_south_west.y);

                // 如果区域过小
                if (pixel_x < 10 || pixel_y < 10) {
                    marker.setContent('<p class="rank_index" style="background:' +
                        extData.color + ';">' + (index + 1) + '</p>');
                } else {
                    marker.setContent('<p class="district_name">' + extData.name +
                        '</p>');
                }
            });



            var mapBounds = mapObj.getBounds(),
                limit_north_east = mapBounds.getNorthEast(),
                limit_south_west = mapBounds.getSouthWest(),
                limit_distance = limit_north_east.distance(limit_south_west),
                covers_north_east = totalBounds.getNorthEast(),
                covers_south_west = totalBounds.getSouthWest(),
                covers_distance = covers_north_east.distance(covers_south_west);

            //如果当前所有区域都可视
            //禁止再次缩小

            if (covers_distance < limit_distance) {


                mapObj.setFitView(covers);
                //清空上次选中区县
                lastCheckedid = "";

                safeApply($scope, function() {
                    distance_subtr && $scope.showAllCountys && $scope.showAllCountys();
                })
            }
            lastZoom = mapObj.getZoom();
            distance_subtr = covers_distance > limit_distance;

        });

    };

    return {
        scope: {
            // 区县地理/人口/adcode数据
            rank: '=',
            showAllCountys: '&',
            showItemCounty: '&'
        },
        require: '^?ngModel',
        link: link
    }
}]);

lbiApp.directive('amapmenu', ['safeApply', function(safeApply) {
    var link = function($scope, iElm, iAttrs, ngModel) {
        var mapObj = ngModel.$viewValue;
        var contextMenu;

        //如果mapObj没有被实例化
        if ($.type(mapObj) !== "object") {
            setTimeout(function() {
                link($scope, iElm, iAttrs, ngModel);
            }, 100);
            return false;
        };

        AMap.event.addListener(mapObj, 'rightclick', function(e) {
            var addEnable = iAttrs.addEnable == 'true' ? true : false;

            if (!addEnable) {
                return false;
            }

            $scope.clickCall && safeApply($scope, function() {
                $scope.clickCall({
                    e: e
                });
            })
        });



    };
    return {
        require: '^?ngModel',
        scope: {
            clickCall: '&'
        },
        link: link
    }
}])
