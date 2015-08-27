var lbiApp = angular.module('lbiApp');

lbiApp.controller('normalUseCtrl', [
  '$scope',
  'lbiService',
  'fetureLabels',
  'onlineShoplist',
  'offlineListResource',
  '$state',
  'safeApply',
  'formatwkt',
  'tagEnitySwitch',
  'SweetAlert',
  function(
    $scope,
    lbiService,
    fetureLabels,
    onlineShoplist,
    offlineListResource,
    $state,
    safeApply,
    formatwkt,
    tagEnitySwitch,
    SweetAlert
  ) {

    var reqParams, taobaoTag, cityTag = '112117';

    //根据会员文件获取有数据的城市列表
    var requestCurcitylist = function(params) {
      params.tagEntitys = params.tagEntitys || {};
      if (params.flag == '1') {
        params.tagEntitys[taobaoTag] = [params.usershopid];
      }
      params.tagEntitys = tagEnitySwitch(params.tagEntitys);

      lbiService('getCitylistByFilter', params, 'POST').then(function(
        info) {
        $scope.citylist = info;
      }, function(desc) {
        $scope.reqError = true;
        $scope.citylist = [];
        SweetAlert.swal({
          title: '当前文件匹配人数过少!',
          text: desc,
          confirmButtonColor: '#399eee',
          confirmButtonText: '确定'
        });
      });
    };


    //获取线下会员文件匹配结果
    var getFileInfo = function() {

      reqParams = {
        flag: $scope.crowdType,
        usershopid: $scope.onlineTaobaoCheckedId,
        fileId: $scope.offlineMemberCheckedId,
        tagEntitys: {},
        adcode: $scope.citycode,
        datatype: 'C5'
      }
      reqParams.tagEntitys[cityTag] = [$scope.citycode];
      //如果是当前受众来源线上淘宝会员
      if (reqParams.flag == '1') {
        reqParams.tagEntitys[taobaoTag] = [reqParams.usershopid];
      }

      return lbiService('getFileInfo', $.extend({}, reqParams, {
        tagEntitys: tagEnitySwitch(reqParams.tagEntitys)
      }), 'POST').then(matchRequestSuccessed, matchRequestFailed);


    };

    //如果会员文件和会员信息匹配成功
    var matchRequestSuccessed = function(result) {
      $scope.reqError = false;
      $scope.crowdCount = result[0].crowdCount;
      $scope.$broadcast('MATCH_SUCCESSED', reqParams);
    }

    var matchRequestFailed = function() {
      $scope.reqError = true;
      $scope.$broadcast('MATCH_FAILED');
    }

    $scope.offlineMemberList = [];
    $scope.onlineTaobaoList = [];
    var getShopCount = function(tags) {
      var tagEntitys = {};
      tagEntitys[taobaoTag] = [$scope.onlineTaobaoCheckedId];
      //请求线上淘宝店会员总数
      return lbiService('getShopCount', {
        tagEntitys: tagEnitySwitch(tagEntitys)
      })
    };


    $scope.$watch('crowdType+onlineTaobaoCheckedId', function() {
      // 如果受众是线上淘宝店会员

      if ($scope.crowdType == '1' && $scope.onlineTaobaoCheckedId) {
        fetureLabels.then(getShopCount).then(function(result) {
          $scope.totalCount = result[0].memberfilecount;
          $scope.matchPercent = 100;
          $scope.matchCount = result[0].memberfilecount;
        });
        //发送数据请求
        requestCurcitylist({
          flag: '1',
          usershopid: $scope.onlineTaobaoCheckedId
        });
      }
    });

    $scope.$watch('crowdType+offlineMemberCheckedId', function() {
      // 如果受众人群是线下会员
      if ($scope.crowdType == '0' && $scope.offlineMemberCheckedId) {
        var site;
        var sitem = $.grep($scope.offlineMemberList, function(item) {
          return item.id == $scope.offlineMemberCheckedId
        })[0];
        $scope.totalCount = sitem['count'];
        $scope.matchPercent = (sitem.percent * 100).toFixed(2);
        $scope.matchCount = Math.floor($scope.totalCount * sitem[
          'percent']);

        //发送数据请求
        requestCurcitylist({
          flag: '0',
          fileId: $scope.offlineMemberCheckedId
        });
      }
    });


    //获取线下会员文件列表
    offlineListResource.query().then(function(info) {
      $scope.offlineMemberList = info;
      $scope.offlineMemberCheckedId = info[0].id;
    });

    //获取线上会员文件列表
    fetureLabels.then(function(tags) {
      taobaoTag = tags[0]['member'][0]['tagid'];
    }).then(function() {
      return onlineShoplist;
    }).then(function(list) {
      $scope.onlineTaobaoList = list;
      $scope.onlineTaobaoCheckedId = list[0].dataId
      $scope.crowdType = '1';
    });


    // 默认商圈类型是城市
    $scope.areaTypeChecked = 'C5';

    //接受城市信息
    $scope.checkcity = function(poi) {
      $scope.citycode = poi.citycode;
      $scope.cityname = poi.cityname;
      getFileInfo();
      $scope.$broadcast('BROADCAST_CUR_CITYINFO', poi);
    }
  }
]);

//会员地理位置分布
lbiApp.controller('memberLocationCtrl', [
  '$scope',
  'lbiService',
  'userStatus',
  'getGridTileLegend',
  'tileLegend',
  'tagEnitySwitch',
  'fetureLabels',
  'SweetAlert',
  'formatwkt',
  'safeApply',
  function(
    $scope,
    lbiService,
    userStatus,
    getGridTileLegend,
    tileLegend,
    tagEnitySwitch,
    fetureLabels,
    SweetAlert,
    formatwkt,
    safeApply
  ) {

    var reqParams = {},
      reqError = false,
      userId,
      cityTag = '112117',
      districtTag = '112706',
      checkedlabels = {},
      // 判断当前地图级别是否是区县
      //如果是区县
      isMaplevelEqualDistrict = function(params) {
        //如果当前城市adcode!==当前curadcpde
        //表示当前地图级别是级别
        if ($scope.poi.citycode !== $scope.curadcode) {
          delete params[cityTag];
          params[districtTag] = [$scope.curadcode];
        } else {
          delete params[districtTag];
          params[cityTag] = [$scope.curadcode];
        }
        return params
      },
      //获取当前城市每个区县的面数据
      getCount = function() {
        if (!reqParams.hasOwnProperty('datatype')) {
          return false;
        }

        var finalParams = $.extend(true, {}, reqParams);

        finalParams = $.extend(true, finalParams, {
          tagEntitys: checkedlabels
        });


        delete finalParams['tagEntitys'][districtTag];
        finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);
        // 现获取当前城市的总的人口数 (数据来源：SQL语句)
        // 然后再请求筛选人数（数据来源：DMP）
        lbiService('getDistribeCount', finalParams, 'POST').then(
          getDistribeSuccessed, getDistribeFailed);
      },
      //获取城市面数据成功
      getDistribeSuccessed = function(info) {
        //城市面数据（各个区县）
        var districtData = info[0].cityDistribeInfo;
        $scope.districtLegend = tileLegend(info[0].legends, 'rank');
        $.each(districtData, function(index, item) {
          var wkt = [];
          // 默认只使用一个区域
          $.each(item.wkt, function(wndex, wtem) {
            wkt = wkt.concat(formatwkt(wtem));
          });
          item.wkt = wkt;
        });

        $scope.districtData = districtData;

        //如果当前地图级别是区县 不直接getFilterCount 这个流程会showItemCounty中执行
        if ($scope.curadcode == $scope.poi.citycode) {
          return getFilterCount();
        } else {
          return false;
        }

      },
      //获取城市下的区县面失败
      getDistribeFailed = function(desc, errcode) {
        SweetAlert.swal({
          title: '无法绘制区县面!',
          text: desc,
          confirmButtonColor: '#399eee',
          confirmButtonText: '确定'
        }, function() {
          $scope.districtData = [];
        })
      },
      getFilterCount = function() {
        var finalParams = $.extend(true, {}, reqParams);

        finalParams = $.extend(true, finalParams, {
          tagEntitys: checkedlabels
        });

        //判断当前地图级别是否是区县级别
        //如果是区县 从tagEntitys中删除城市adcode 添加区县adcode
        finalParams.tagEntitys = isMaplevelEqualDistrict(finalParams.tagEntitys);
        finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);

        //继续请求当前城市/区县
        lbiService('getCount', finalParams, 'POST').then(
          accessDistributeSuccessed, accessDistributeFailed);
      },
      accessDistributeSuccessed = function(info) {
        $scope.reqError = false;
        $scope.crowdCount = info[0].crowdCount;
      },
      accessDistributeFailed = function() {
        $scope.crowdCount = false;
        $scope.districtData = [];
        $scope.reqError = true;
        $scope.tileParams = {};
        $scope.showTileThumb = false;
        $scope.curcountyname = undefined;
      },
      getLegends = function() {
        var finalParams = $.extend(true, {
          size: 600
        }, reqParams);

        finalParams = $.extend(true, finalParams, {
          tagEntitys: checkedlabels
        });

        //判断当前地图级别是否是区县级别
        //如果是区县 从tagEntitys中删除城市adcode 添加区县adcode
        finalParams.tagEntitys = isMaplevelEqualDistrict(finalParams.tagEntitys);
        finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);

        getGridTileLegend(finalParams).then(function(info) {

          $scope.showTileThumb = true;
          $scope.originLegends = info.legends;
          $scope.gridSize = info.size;
          $scope.tileLegends = tileLegend(info.legends);

        });
        return false;

        lbiService('getLegends', finalParams, 'POST').then(function(info) {
          $scope.showTileThumb = true;
          $scope.originLegends = info;
          $scope.tileLegends = tileLegend(info);
        });
      },
      getGids = function(range) {
        var finalParams = $.extend(true, {
          size: $scope.gridSize,
          section: range.join(';')
        }, reqParams);

        finalParams = $.extend(true, finalParams, {
          tagEntitys: checkedlabels
        });

        //判断当前地图级别是否是区县级别
        //如果是区县 从tagEntitys中删除城市adcode 添加区县adcode
        finalParams.tagEntitys = isMaplevelEqualDistrict(finalParams.tagEntitys);
        finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);
        //先获取GID列表

        lbiService('getGids', finalParams, 'POST').then(function(res) {
          // 瓦片参数
          $scope.tileParams = {
            gids: res[0].gids,
            bound: $scope.districtBound,
            legend: $scope.originLegends
          }
        })
      };

    //获取用户Id
    userStatus.then(function(info) {
      useId = info.memberId;
    });



    //接受当前所在城市
    //标记
    $scope.$on('BROADCAST_CUR_CITYINFO', function(e, poi) {
      $scope.poi = poi;
      $scope.curadcode = poi.citycode;
    });


    //接受当前选中图例
    $scope.selectLegends = function(legends) {
      if (legends.length) {
        getGids(legends);
      } else {
        $scope.tileParams = {};
      }
    }


    $scope.showAllCountys = function() {

      $scope.showTileThumb = false;
      $scope.tileParams = {};

      $scope.curcountyname = '';
      $scope.curadcode = $scope.poi.citycode;
      getFilterCount();
    };


    $scope.showItemCounty = function(bound, info) {
      $scope.curcountyname = '-' + info.name;

      $scope.curadcode = info.id;
      if (!Number(info.count)) {
        $scope.showTileThumb = false;
        return false;
      }


      if (!isNaN(info.count) && Number(info.count) > 150) {
        //获取动态区间/获取GID
        $scope.districtBound = bound;
        getLegends();
        //获取当前区域筛选人数
        getFilterCount();
      } else {
        safeApply($scope, function() {
          $scope.tileParams = {};
          $scope.crowdCount = 0;
          $scope.reqError = true;
        })
      }
    };



    // 如果parent controller 文件匹配成功
    $scope.$on('MATCH_SUCCESSED', function(e, params) {
      reqParams = $.extend({}, params);
      getCount();
    });

    //如果匹配失败
    $scope.$on('MATCH_FAILED', function(e) {
      $scope.reqError = true;
      reqParams = {};
      // 清除t网格图
      accessDistributeFailed();
    });

    //获取标签
    fetureLabels.then(function(tags) {
      $scope.filterLabels = tags[0]['base'];
    });

    $scope.checkedFilterLabels = function(labels) {
      checkedlabels = labels;
      getCount();
    };

    //区县legend
    // $scope.countPercentThumb = countPercentThumb;

  }
]);

//商圈排名
lbiApp.controller('circleRankCtrl', [
  '$scope',
  'lbiService',
  'safeApply',
  'formatwkt',
  'fetureLabels',
  'tagEnitySwitch',
  'tileLegend',
  function(
    $scope,
    lbiService,
    safeApply,
    formatwkt,
    fetureLabels,
    tagEnitySwitch,
    tileLegend) {

    var reqParams,
      cityTag = '112117',
      sysCircleTag,
      // 请求线上淘宝文件列表
      querySysCiclerank = function() {

        // 发送请求
        lbiService('getRankOfCircleByNum', reqParams).then(function(info) {
          $.each(info[0].sysAreaInfo, function(index, item) {
            item.wkt = formatwkt(item.wkt);
          });
          //展示的legend
          $scope.rankLegend = tileLegend(info[0].legends, 'rank');
          $scope.rank = info[0].sysAreaInfo.slice(0, 20);
          $scope.curPage = 1;
          $scope.reqError = false;

        }, function() {
          $scope.reqError = true;
        })
      },
      //获取当前网格图例
      // @param{item} 包含商圈ID信息
      getLegends = function(item) {

        //删除城市tag
        delete reqParams.tagEntitys[cityTag];
        reqParams.tagEntitys[sysCircleTag] = [item.id];

        var finalParams = $.extend({
          size: 300
        }, reqParams, {
          datatype: 'C1'
        });


        // tagEntitys格式转换
        finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);

        lbiService('getLegends', finalParams, 'POST').then(function(info) {
          $scope.showTileThumb = true;
          $scope.originLegends = info;
          $scope.tileLegends = tileLegend(info);
        });
      },
      //获取GID
      // @params{range} ['0,150','151,300']
      getGids = function(range) {
        //删除tagEntity中城市TAG

        var finalParams = $.extend({
          size: 300,
          section: range.join(';')
        }, reqParams, {
          datatype: 'C1'
        });

        finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);
        lbiService('getGids', finalParams, 'POST').then(function(res) {
          $scope.showTileThumb = true;

          // 瓦片参数
          $scope.tileParams = {
            gids: res[0].gids,
            bound: $scope.curCircleBound,
            legend: $scope.originLegends
          }
        });
      };


    $scope.size = 10; //默认一页展示10条
    $scope.curPage = 1;
    $scope.rank = [];
    $scope.totalCount = 0;


    $scope.$watch('curPage', function(curPage) {
      if (!isNaN(curPage)) {
        $scope.tileParams = {};
        $scope.showTileThumb = false;
      }
    });

    // 如果parent controller 文件匹配成功
    $scope.$on('MATCH_SUCCESSED', function(e, params) {
      reqParams = $.extend({}, params);
      querySysCiclerank();
    });

    //如果匹配失败
    $scope.$on('MATCH_FAILED', function(e) {
      $scope.reqError = true;
      $scope.rank = [];
      $scope.tileParams = {};
      $scope.showTileThumb = false;
      reqParams = {};
    });

    //接受当前所在城市
    //标记
    $scope.$on('BROADCAST_CUR_CITYINFO', function(e, poi) {
      $scope.poi = poi;
      $scope.curadcode = poi.citycode;
    });

    //接受当前选中图例
    $scope.selectLegends = function(legends) {

      if (legends.length) {
        getGids(legends);
      } else {
        $scope.tileParams = {};
      }
    }

    //放大某个商圈
    $scope.zoom = function($index, item) {
      $scope.selectedIndex = $index;
    };

    // $scope.countPercentThumb = countPercentThumb;

    //接受常驻商圈TAG
    fetureLabels.then(function(allTag) {
      sysCircleTag = allTag[0]['circle'][0]['tagid'];
    });

    //获取某个商圈图例的网格
    $scope.showItemCounty = function(bound, info) {
      if (isNaN(info.count) || Number(info.count) <= 150) {
        return false;
      }
      //
      $scope.curCircleBound = bound;
      $scope.curCircleInfo = info;
      getLegends(info);
    }
  }
]);

//半年内小区销售排名 维度:人数
lbiApp.controller('halfYearRankCtrl', [
  '$scope',
  'lbiService',
  'formatwkt',
  'tileLegend',
  function($scope, lbiService, formatwkt, tileLegend) {



    var reqParams = {},
      // 请求小区排名
      getRank = function() {

        delete reqParams['tagEntitys'];
        lbiService('getRankOfArea', reqParams).then(function(info) {

          $.each(info[0].distInfo, function(index, item) {
            item.wkt = formatwkt(item.wkt);
            item.id = ('' + item.x + item.y).replace('.', '');
          });
          $scope.rankLegend = tileLegend(info[0].legends, 'rank')
          $scope.rank = info[0].distInfo;
          $scope.curPage = 1;

          $scope.reqError = false;
        }, function() {
          $scope.reqError = true;
          $scope.rank = [];
        });
      };

    $scope.size = 10; //默认一页展示10条
    $scope.curPage = 1;
    $scope.rank = [];

    // $scope.countPercentThumb = countPercentThumb;

    // 如果parent controller 文件匹配成功
    $scope.$on('MATCH_SUCCESSED', function(e, params) {
      reqParams = $.extend({}, params);
      getRank();
    });

    //如果匹配失败
    $scope.$on('MATCH_FAILED', function(e) {
      $scope.reqError = true;
      reqParams = {};
      $scope.showTileThumb = false;
      $scope.tileParams = {};
      $scope.rank = [];
    });

    //接受parent contorller 传递的当前商圈信息
    $scope.$on('BROADCAST_CUR_CITYINFO', function(e, poi) {
      $scope.poi = poi;
    });

    $scope.zoom = function($index, item) {
      $scope.selectedIndex = $index;
      $scope.zoomIndex = $index - ($scope.curPage - 1) * $scope.size;
    };

    //鼠标滑过某个小区
    $scope.hoverCircleItem = function(poi, $index) {
      $scope.hoverIndex = $index + ($scope.curPage - 1) * $scope.size;
    }

  }
]);

//常去POI
lbiApp.controller('oftenpoiCtrl', [
  '$scope',
  'lbiService',
  'tagEnitySwitch',
  function($scope, lbiService, tagEnitySwitch) {
    var reqParams = {};

    //查询排名结果
    var queryRank = function() {
      if (!reqParams.hasOwnProperty('flag')) {
        return false;
      }
      var finalParams = $.extend({}, reqParams);
      finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);
      lbiService('gonePOIRank', finalParams).then(function(info) {
        $scope.reqError = false;
        $scope.rank = info;
        $scope.curPage = 1;
      });

    };

    $scope.size = 10; //默认一页展示10条
    $scope.curPage = 1;
    $scope.rank = [];
    //餐饮服务 超市 还有体育休闲
    $scope.poitypes = [{
      name: '餐饮服务',
      type: '050000'
    }, {
      name: '超市',
      type: '060400'
    }, {
      name: '体育休闲',
      type: '080000'
    }];

    //默认选中餐饮服务作为选中的POI
    $scope.poitype = '050000';
    //如果 parent controller匹配成功
    $scope.$on('MATCH_SUCCESSED', function(e, params) {
      reqParams = $.extend(reqParams, params);
      queryRank();
    });
    //匹配失败
    $scope.$on('MATCH_FAILED', function(e, params) {
      $scope.reqError = true;
    });

    //接受parent contorller 传递的当前商圈信息
    $scope.$on('BROADCAST_CUR_CITYINFO', function(e, poi) {
      $scope.poi = poi;
    });

    //选择当前的POI类型
    $scope.$watch('poitype', function(poitype) {
      reqParams = $.extend(reqParams, {
        poitype: poitype
      });
      queryRank();
    });
  }
]);


//会员画像
lbiApp.controller('memberMsgCtrl', [
  '$scope',
  'lbiService',
  'tagEnitySwitch',
  function($scope, lbiService, tagEnitySwitch) {
    //接受当前商圈ID 会员文件ID
    $scope.dataSource = {};
    //请求筛选人群参数map
    var reqParams = {}
      //模拟假数据
      //性别 职业 城市 消费额 月均消费指数 年龄 商品折扣率 兴趣点 点击偏好和数据的映射表
    var idLabelMaps = {
      2: 'gender',
      3: 'job',
      4: 'city',
      7: 'amout_consume',
      8: 'avg_consume',
      1: 'age',
      9: 'shop_discount',
      11: 'fav_point',
      111330: 'click_perf',
      111159: 'buy_prefer',
      111053: 'has_child',
      111067: 'wireless_online_range_7d',
      111066: 'pc_online_range_7d',
      22212: 'app_type',
      22211: 'user_tag'
    };

    // 如果parent controller 文件匹配成功
    $scope.$on('MATCH_SUCCESSED', function(e, params) {
      reqParams = $.extend({}, params);
      getMemberMsg();
    });

    //如果匹配失败
    $scope.$on('MATCH_FAILED', function(e) {
      reqError = true;
      reqParams = {};
    });


    //获取会员画像信息
    function getMemberMsg() {

      var finalParams = $.extend({}, reqParams);
      finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);
      lbiService('getMemberMsg', finalParams).then(function(info) {
        $scope.reqError = false;
        childDatasourceById(info);
      }, function() {
        $scope.reqError = true;
      });
    }

    //拆分数据 方便directive调用
    function childDatasourceById(fakeDatasource) {
      var dataSource = {};

      $.each(fakeDatasource, function(index, item) {
        var id = item[0],
          label = idLabelMaps[id];

        dataSource[label] = item[2];
      });
      $scope.dataSource = dataSource;
    }
  }
]);
