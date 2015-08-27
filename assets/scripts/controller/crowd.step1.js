// 圈定营销人群
lbiApp.controller('createMarket.step1Ctrl', [
  '$q',
  '$scope',
  'lbiService',
  'fetureLabels', //获取标签
  'userStatus', //获取用户信息
  'onlineShoplist', //获取线上淘宝店列表
  'offlineListResource', //线下会员文件列表
  'tagEnitySwitch',
  '$state',
  'judgeCircleGidsLen',
  'judgeCircleCountLen',
  'SweetAlert',
  'queryPlaceBySearchPoi',
  'querycircleByBatch',
  'queryDistrict',
  'myPoiResource',
  function(
    $q,
    $scope,
    lbiService,
    fetureLabels,
    userStatus,
    onlineShoplist,
    offlineListResource,
    tagEnitySwitch,
    $state,
    judgeCircleGidsLen,
    judgeCircleCountLen,
    SweetAlert,
    queryPlaceBySearchPoi,
    querycircleByBatch,
    queryDistrict,
    myPoiResource
  ) {

    $scope.nextDisabled = true;
    var reqParams = {};
    //验证参数是否符合要求
    var validateTotalParamRequest = function(accepts) {
      reqParams = $.extend(reqParams, accepts);
      // 如果有受众类型 受众特征type 区域type
      if (!reqParams.hasOwnProperty('flag') ||
        !reqParams.hasOwnProperty('featuretype') ||
        !reqParams.hasOwnProperty('datatype')) {
        $scope.crowdCount = 0;
        $scope.nextDisabled = true;
        return false;
      }

      if (reqParams['featuretype'] == 'B3' && reqParams['activetime'] &&
        reqParams['activetime'].length == 0) {
        return false;
      }

      // 如果当前受众类型是实时
      reqParams.scale = reqParams['featuretype'] == 'B3' ? '0' : $scope.multipleNum;
      //获取筛选人口

      //将参数发送给parent controller 保存
      $scope.$emit('PASS_CROWD_PARAMS', reqParams);
      getCount().then(getEndDate).then(validateDateRange).then(function(
        dateObj) {

        $scope.nextDisabled = false; //允许进行下一步

      }, function() {
        $scope.nextDisabled = true;

      });
    };

    // 获取筛选人数
    var getCount = function() {
      return lbiService('getCrowdCount', $.extend({}, reqParams, {
        tagEntitys: tagEnitySwitch(reqParams.tagEntitys || {})
      }), 'POST');
    }

    // 根据标签标签获取系统截止时间
    var getEndDate = function(result) {
      $scope.crowdCount = result[0].crowdCount;
      var finalParam = $.extend(true, {}, reqParams);
      finalParam.tagEntitys = finalParam.tagEntitys || {};
      switch (finalParam.flag) {
        case 'A0':
          delete finalParam['usershopid'];
          break;
        case 'A1':
          delete finalParam['fileId'];
          finalParam.tagEntitys[$scope.usershopTag] = [finalParam[
            'usershopid']];
          delete finalParam['usershopid'];
          break;
        case 'A2':
          delete finalParam['fileId'];
          delete finalParam['usershopid'];
          break;
        default:
          break;
      };
      finalParam.tagEntitys = tagEnitySwitch(finalParam.tagEntitys);
      return lbiService('getTagDateRange', finalParam, 'POST');
    }

    // 验证标签日期是否过期
    var validateDateRange = function(info) {
      var deferred = $q.defer(),
        endDate = info[0].endDate,
        startDate = info[0].startDate;


      if (new Date(endDate).getTime() > new Date(startDate).getTime()) {
        deferred.resolve({
          startDate: startDate,
          endDate: endDate
        })
      } else {
        SweetAlert.swal({
          title: '标签过期',
          text: '请修改标签有效期',
          confirmButtonColor: '#399eee',
          confirmButtonText: '确定'
        });
        deferred.reject();
      }

      $scope.startDate = startDate;
      $scope.endDate = endDate;

      return deferred.promise;
    }


    // 获取标签数据
    fetureLabels.then(function(tags) {
      var allTag = tags[0];
      //接受tags['base']作为用户选择标签
      $scope.usershopTag = allTag['member'][0].tagid;
    });



    //受众数据来源
    $scope.crowdSourceList = [{
      name: '全淘宝会员',
      type: 'A2'
    }];
    //默认指定受众人群来源是线下会员文件
    $scope.crowdSourceChecked = 'A2';

    //默认受众数据来源是线下会员文件
    $scope.offlineMemberList = [];
    $scope.onlineTaobaoList = [];

    //请求线下会员文件列表
    offlineListResource.query().then(function(info) {
      $scope.offlineMemberList = info;
      $scope.crowdSourceList.splice(1, -1, {
        name: '线下会员文件',
        type: 'A0'
      });
      $scope.offlineMemberCheckedId = info[0].id;

    });

    //请求淘宝店会员列表h
    onlineShoplist.then(function(list) {
      $scope.onlineTaobaoList = list;
      $scope.onlineTaobaoCheckedId = list[0].dataId;
      $scope.crowdSourceList.push({
        name: '线上淘宝店会员',
        type: 'A1'
      });
    });


    // 监听会员文件和淘宝文件 全淘宝会员
    var crowdSourceWatchList = [
      'crowdSourceChecked',
      'onlineTaobaoCheckedId',
      'offlineMemberCheckedId'
    ];
    $scope.$watch(crowdSourceWatchList.join('+'), function(v) {
      if (!$scope.crowdSourceChecked) {
        return false;
      }


      var params = {};
      switch ($scope.crowdSourceChecked) {
        case 'A0':
          params = {
            flag: 'A0',
            fileId: $scope.offlineMemberCheckedId
          };
          break;
        case 'A1':
          params = {
            flag: 'A1',
            usershopid: $scope.onlineT
          };
          break;
        case 'A2':
          params = {
            flag: 'A2'
          };
          break;
        default:
          break;
      }
      // 发送请求参数
      validateTotalParamRequest(params);
    });

    //受众特征类型
    $scope.crowdTypeList = [{
      name: '常驻人群',
      type: 'B0'
    }, {
      name: '近一周出现人群',
      type: 'B1'
    }, {
      name: '近一月出现人群',
      type: 'B2'
    }, {
      name: '实时人群',
      type: 'B3'
    }];
    $scope.crowdTypeChecked = 'B0';

    //接受当前实时时段
    $scope.updateRealtime = function(hours) {
      validateTotalParamRequest({
        activetime: hours.join(',')
      });
    }



    //监听受众特征变化 如果受众特征变化 重置所有的选种值
    $scope.$watch('crowdTypeChecked', function() {
      if (!$scope.crowdTypeChecked) {
        return false;
      }
      // 如果选中的是实时
      // 在areaTypeList中删除系统和区县
      if ($scope.crowdTypeChecked == 'B3') {
        $scope.areaTypeList.splice(1, 1);
        $scope.areaTypeList.pop();
        // 如果当前的商圈类型是系统和区县 重置成自定义商圈
      } else {
        // 如果上次选中的状态是实时 添加系统商圈和区县
        if ($scope.areaTypeList.length != originAreaTypeList.length) {
          $scope.areaTypeList = [].concat(originAreaTypeList);
        }
      }

      //如果受众类型切换到实时 当前商圈类型是系统商圈或者区县
      // 参数同时发送id和 datatype
      if ($scope.crowdTypeChecked == 'B3' && ($scope.areaTypeChecked ==
          'C1' || $scope.areaTypeChecked == 'C4')) {
        $scope.areaCheckedList[$scope.areaTypeChecked] = []; //清空系统或者区县ID列表
        $scope.areaCheckedGeoList[$scope.areaTypeChecked] = [];
        $scope.areaTypeChecked = 'C0';
        validateTotalParamRequest({
          featuretype: $scope.crowdTypeChecked,
          datatype: $scope.areaTypeChecked,
          id: $scope.areaCheckedList[$scope.areaTypeChecked].join(
            ',')
        });

      } else {
        validateTotalParamRequest({
          featuretype: $scope.crowdTypeChecked
        });
      }
    });


    //选择商圈类型列表
    //保存原始数据 因为受众类型是实时的时候 要删除系统商圈和区县周边
    var originAreaTypeList = [{
      name: '自定义商圈',
      areaType: 'C0'
    }, {
      name: '系统商圈',
      areaType: 'C1'
    }, {
      name: '实体店周边', //通过我的实体店功能上传
      areaType: 'C2'
    }, {
      name: '兴趣点周边',
      areaType: 'C3'
    }, {
      name: '区县',
      areaType: 'C4'
    }];
    //定义商圈类型列表（删除系统商圈）
    $scope.areaTypeList = [].concat(originAreaTypeList);
    $scope.customCircleList = []; //自定义商圈

    $scope.sysCircleList = []; //系统商圈
    $scope.sysPage = 1;
    $scope.sysKeyword = "";
    $scope.physicalStoreList = []; //实体店周边
    var radiusList = [{
      name: '1公里',
      value: 1000
    }, {
      name: '2公里',
      value: 2000
    }, {
      name: '3公里',
      value: 3000
    }]
    $scope.physicalStoreRadiusList = [].concat(radiusList);
    // 实体店和兴趣点的选中半径
    $scope.areaCheckedRadius = {
      'C2': '1000',
      'C3': '500'
    }

    $scope.poiList = []; //兴趣点
    $scope.poiStoreRadiusList = [{
      name: '500米',
      value: 500
    }, {
      name: '700米',
      value: 700
    }, {
      name: '1000米',
      value: 1000
    }];
    $scope.poiPageIndex = 1; //默认POI为第一页
    $scope.countryList = []; //区县
    $scope.areaTypeChecked = 'C0'; //默认选中的区域类型是自定义商圈
    //选中的商圈 key=>商圈类型 value=>对应选中商圈列表（多选）
    $scope.areaCheckedList = {
      'C0': [],
      'C1': [],
      'C2': [],
      'C3': [],
      'C4': []
    };
    //存放选中商圈的的具体信息 key=>商圈类型 value=>对应商圈列表
    $scope.areaCheckedGeoList = {
      'C0': [],
      'C1': [],
      'C2': [],
      'C3': [],
      'C4': []
    };

    //接收当前城市
    $scope.checkcity = function(poi) {
      $scope.cityname = poi.cityname;
      $scope.citycode = poi.citycode;
      $scope.center = [poi.lng, poi.lat];
      // 当前城市切换以后 重置选中商圈列表数据
      $scope.areaCheckedList = {
        'C0': [],
        'C1': [],
        'C2': [],
        'C3': [],
        'C4': []
      }
      $scope.sysPage = 1;
      $scope.sysKeyword = "";
      $scope.poiPageIndex = 1;
    };

    //查询自定义商圈列表
    var queryCustomCircleList = function() {
      lbiService('circleList', {
        citycode: $scope.citycode,
        all: true
      }, 'GET').then(function(info) {
        $scope.customCircleList = info[0].bizAreaInfo;
        //默认指定第一条数据商圈数据为选中数据
        if ($scope.areaCheckedList[$scope.areaTypeChecked].length ==
          0) {
          $scope.toggleCircleItem([$scope.customCircleList[0].id]);
        }
        // $scope.cutstomCircleCheckedId = info[0].bizAreaInfo[0].id;
      });
    };
    // 查询自定义商圈
    var querySysCircleList = function() {
      lbiService('sysCirclelist', {
        all: false,
        citycode: $scope.citycode,
        pageNo: $scope.sysPage,
        keyword: $scope.sysKeyword
      }).then(function(info) {
        $scope.sysCircleList = info[0].bizAreaInfo;
        $scope.sysTotal = info[0].totalCount;
        $scope.sysPage = info[0].pageNo;

        //默认指定第一条数据商圈数据为选中数据
        if ($scope.areaCheckedList[$scope.areaTypeChecked].length ==
          0) {
          $scope.toggleCircleItem([$scope.sysCircleList[0].id]);
        }
      });
    };
    // 查询实体店
    var queryPhysicalStorList = function() {
      // 获取上传文件列表
      lbiService('getFiles', {}).then(getPhysicalStoreById);
    };
    //根据文件ID 获取文件信息
    var getPhysicalStoreById = function(files) {
      var fileid = files[0].id;
      lbiService('getPhysicalStoreList', {
        adcode: $scope.citycode,
        fileid: fileid,
        ismatch: 1
      }).then(function(info) {
        $scope.physicalStoreList = info;
        if ($scope.areaCheckedList[$scope.areaTypeChecked].length ==
          0) {
          $scope.toggleCircleItem([$scope.physicalStoreList[0].id]);
        }
      });
    };
    //获取我关注的POI列表
    var queryPOIList = function() {
      // 查询我的兴趣点

      myPoiResource.query().then(function(info) {
        // 如果用户没有选择兴趣点
        //直接点开编辑界面

        $scope.poiList = info;
        $scope.checkedPoi = info[0].type;
      });
    };
    //获取选中的POi 实体店列表
    var queryPoiStoreList = function() {
      var searchKey = $.grep($scope.poiList, function(item) {
        return item.type == $scope.checkedPoi;
      })[0].desc;

      queryPlaceBySearchPoi({
        city: $scope.citycode,
        key: searchKey,
        page: $scope.poiPageIndex,
        type: $scope.checkedPoi,
        pagesize: 30
      }).then(function(result) {
        $scope.poiStoreTotalPage = result.totalPage;
        $scope.poiStoreList = result.pois;
        if ($scope.areaCheckedList[$scope.areaTypeChecked].length ==
          0) {
          $scope.toggleCircleItem([$scope.poiStoreList[0].id]);
        }
      });
    };
    //查询区县列表
    var querycountryList = function() {
      queryDistrict({
        citycode: $scope.citycode,
        cityname: $scope.cityname
      }).then(function(result) {
        $scope.countryList = result;
        $scope.checkedCountry = result[0].adcode;
      });
    };

    // 监听当前选中的区县
    $scope.$watch('checkedCountry', function() {
      if (!$scope.checkedCountry) {
        return false;
      }
      //获取当前区县的具体坐标信息
      queryDistrict({
        cityname: $scope.checkedCountry
      }, 'district').then(function(boundary) {
        $scope.areaCheckedGeoList['C4'] = [boundary];

      });
      // 请求验证参数
      validateTotalParamRequest({
        datatype: 'C4',
        adcode: $scope.checkedCountry
      });
    });


    // 获取选中的自定义商圈的具体信息
    //获取选中的系统商圈的具体地理位置信息
    var citycodes = {};
    var getCircleDetailInfo = function(type) {
      var newIncreaseIds = []; //新添加系统商圈ID列表
      var reBuildCheckedGeoList = [];
      var copyCheckedGeoList = {};
      // 循环上一次系统商圈具体信息
      $.each($scope.areaCheckedGeoList[type], function(sIndex, sItem) {
        //不能直接使用sItem 防止被污染
        copyCheckedGeoList[sItem.id] = $.extend({}, sItem);
      });

      // 循环检查选中ID列表
      $.each($scope.areaCheckedList[type], function(index, cid) {
        if (!copyCheckedGeoList.hasOwnProperty(cid)) {
          newIncreaseIds.push(cid);
        } else {
          //打一个标记 表示这个商圈还是选中状态没有被删除
          copyCheckedGeoList[cid].isFlag = true;
        }
      });

      $.each(copyCheckedGeoList, function(cid, sItem) {
        // 如果没有标记 表明这个商圈已经被从选中状态中删除掉了
        // 如果有标记 表示这个商圈还是存在的
        if (sItem.isFlag) {
          delete sItem.isFlag;
          reBuildCheckedGeoList.push(sItem);
        }
      });
      // 如果新增商圈id列表存在
      // 批量获取系统信息
      if (newIncreaseIds.length) {
        querycircleByBatch(newIncreaseIds).then(function(circles) {
          $scope.areaCheckedGeoList[type] = reBuildCheckedGeoList.concat(
            circles);
        });
      } else {
        $scope.areaCheckedGeoList[type] = reBuildCheckedGeoList;
      }


      // 发送源于自定义或者系统商圈的请求参数
      validateTotalParamRequest({
        datatype: type,
        id: $scope.areaCheckedList[type].join(',') //自定义商圈或者系统商圈列表ID集合
      });
    };

    //获取选中实体店的具体地理位置信息
    var getphysicalStoreDetailInfo = function() {
      var checkedPhysicalDetailList = [];
      $.each($scope.areaCheckedList['C2'], function(index, physicalId) {
        var result = $.grep($scope.physicalStoreList, function(item) {
          return item.id == physicalId;
        })[0];
        checkedPhysicalDetailList.push({
          id: physicalId,
          lng: result.x,
          lat: result.y,
          radius: $scope.areaCheckedRadius['C2']
        });
      });
      $scope.areaCheckedGeoList['C2'] = checkedPhysicalDetailList;
      // 发送关于实体店的请求参数
      validateTotalParamRequest({
        datatype: 'C2',
        regions: $.map(checkedPhysicalDetailList, function(item,
          index) {
          return item.lng + ',' + item.lat;
        }).join(';'),
        radius: $scope.areaCheckedRadius['C2']
      });

    };

    //获取选中兴趣点的具体地理信息
    var getPoiStoreDetailInfo = function() {
      var checkedPoiDetailList = [];
      var copyCheckedPoiIdList = [].concat($scope.areaCheckedList['C3']);
      $.each($scope.poiStoreList, function(index, item) {
        var site = $.inArray(item.id, copyCheckedPoiIdList);
        if (site != -1) {
          checkedPoiDetailList.push({
            lng: item.location.lng,
            lat: item.location.lat,
            id: item.id,
            radius: $scope.areaCheckedRadius['C3']
          });
          delete copyCheckedPoiIdList[site];
        }
      });

      $.each($scope.areaCheckedGeoList['C3'], function(index, item) {
        var site = $.inArray(item.id, copyCheckedPoiIdList);
        if (site != -1) {
          checkedPoiDetailList.push(item);
          delete copyCheckedPoiIdList[site];
        }
      });

      $scope.areaCheckedGeoList['C3'] = checkedPoiDetailList;
      //发送数据验证
      validateTotalParamRequest({
        datatype: 'C3',
        regions: $.map(checkedPoiDetailList, function(item, index) {
          return item.lng + ',' + item.lat;
        }).join(';'),
        radius: $scope.areaCheckedRadius['C3']
      });
    };

    //当区域数据judge成功以后
    //只有当type=='C3'的时候 兴趣点的时候传递POi
    var areaParamValidatedFunc = function() {
      switch ($scope.areaTypeChecked) {
        case 'C0':
          getCircleDetailInfo('C0');
          break;
        case 'C1':
          getCircleDetailInfo('C1');
          break;
        case 'C2':
          getphysicalStoreDetailInfo();
          break;
        case 'C3':
          getPoiStoreDetailInfo();
          break;
        default:
          break;
      };
      //
    };

    //修改兴趣点/实体店半径
    var areaRadiusValidateFunc = function() {
      var originSelectedCircles = [].concat($scope.areaCheckedGeoList[
        $scope.areaTypeChecked]);
      $.each(originSelectedCircles, function(index, item) {
        item.radius = $scope.areaCheckedRadius[$scope.areaTypeChecked];
      });
      $scope.areaCheckedGeoList[$scope.areaTypeChecked] =
        originSelectedCircles
    };



    //监听商圈类型/城市code
    $scope.$watch('areaTypeChecked+citycode', function() {
      if (!$scope.citycode) {
        return false;
      }
      switch ($scope.areaTypeChecked) {
        //自定义商圈
        case 'C0':
          queryCustomCircleList();
          break;
        case 'C1':
          querySysCircleList();
          break;
        case 'C2':
          queryPhysicalStorList();
          break;
        case 'C3':
          queryPOIList();
          break;
        case 'C4':
          querycountryList();
          break;
      }

      // 档切换商圈类型的时候
      if ($scope.areaCheckedList[$scope.areaTypeChecked].length) {
        areaParamValidatedFunc()
      }
    });

    //监听系统商圈的page和keyword
    $scope.$watch('sysPage+sysKeyword', function() {
      if ($scope.areaTypeChecked != 'C1') {
        return false;
      }
      querySysCircleList();

    });
    // 系统商圈翻页函数
    $scope.sysPaging = function(page) {
      $scope.sysPage = page;
    };

    //非实时 需要监听兴趣点半径/实体店 判断是否超过gids的最大限制
    $scope.$watch('areaCheckedRadius', function(areaCheckedRadius) {
      //如果当前没有选中的实体店/兴趣点
      if ($scope.areaCheckedGeoList[$scope.areaTypeChecked].length == 0) {
        return false;
      }
      getCircleCountUpdateJudgeMethod()({
        regions: $.map($scope.areaCheckedGeoList[$scope.areaTypeChecked],
          function(item) {
            return item.lng + ',' + item.lat
          }).join(';'),
        type: $scope.areaTypeChecked,
        radius: $scope.areaCheckedRadius[$scope.areaTypeChecked]
      }).then(function() {
        validateTotalParamRequest({
          radius: $scope.areaCheckedRadius[$scope.areaTypeChecked]
        });
        // 绘制商圈
        areaRadiusValidateFunc();
      }, function(desc, errcode) {
        SweetAlert.swal({
          title: '修改失败',
          text: desc,
          confirmButtonColor: '#399eee',
          confirmButtonText: '确定'
        });
      });
    }, true);



    //监听当前城市和选中POI类型 获取POI点在当前城市的分布
    $scope.$watch('citycode+checkedPoi', function() {
      if (!$scope.checkedPoi || !$scope.citycode || $scope.areaTypeChecked !=
        'C3') {
        return false;
      }
      $scope.areaCheckedList['C3'] = [];
      $scope.areaCheckedGeoList['C3'] = [];
      $scope.poiPageIndex = 1;
      queryPoiStoreList();

    });

    //兴趣点周边实体店翻页
    $scope.poiStorePaging = function(page) {
      $scope.poiPageIndex = page;

      if (!$scope.checkedPoi) {
        return false;
      }
      //查询下一页POI
      queryPoiStoreList();
    }

    //获取商圈限制判断方法
    //如果是非实时同时商圈类型不是系统商圈 使用gid判断方法

    var getCircleCountUpdateJudgeMethod = function() {

      return $scope.crowdTypeChecked !== 'B3' && $scope.areaTypeChecked !==
        'C1' ? judgeCircleGidsLen : judgeCircleCountLen;
    };

    //添加或者删除选中商圈
    $scope.toggleCircleItem = function(items) {
      // 备份数据 防止更新失败
      var originSelectedItem = [].concat($scope.areaCheckedList[$scope.areaTypeChecked]);
      // 把新添加的数据放到items
      $.each(items, function(index, item) {
        if ($.inArray(item, originSelectedItem) == -1) {
          originSelectedItem.push(item);
        }
      });



      var isite = $.inArray(items[0], $scope.areaCheckedList[$scope.areaTypeChecked]);
      // 如果是批量添加 添加的ID列表在当前的选中列表已经存在 则不需要任何操作
      if (items.length > 1 && originSelectedItem.length == $scope.areaCheckedList[
          $scope.areaTypeChecked].length) {
        return false;
      }


      //如果当前用户要删除一个商圈 同时当前选中的商圈长度为1 禁止删除
      if (isite != -1 && items.length == 1 && $scope.areaCheckedList[
          $scope.areaTypeChecked].length == 1) {
        return false
      }



      //如果是要执行一个删除
      if (items.length == 1 && isite != -1) {
        // 当选中商圈长度超过1的时候 才允许删除
        $scope.areaCheckedList[$scope.areaTypeChecked].splice(isite, 1);
        areaParamValidatedFunc();
      }
      //如果是新增 向后台请求
      //当受众类型是实时的时候 个数是否超过两百
      //else 请求后台判断gids.length>200
      else {
        var judgeParams = {};
        switch ($scope.areaTypeChecked) {
          case 'C0':
            judgeParams = {
              ids: originSelectedItem.join(','),
              type: 'C0'
            };
            break;
          case 'C1':
            judgeParams = {
              ids: originSelectedItem.join(','),
              type: 'C1'
            };
            break;

          case 'C2':
            var grepResult = [];
            $.each($scope.physicalStoreList, function(index, item) {
              if (originSelectedItem.join(',').indexOf(item.id) != -1) {
                grepResult.push(item.x + ',' + item.y);
              }
            });
            judgeParams = {
              regions: grepResult.join(';'),
              radius: $scope.areaCheckedRadius['C2'],
              type: 'C2'
            };
            break;
          case 'C3':
            var grepResult = [];
            var copyCurPoiIds = [].concat(originSelectedItem); //复制当前选中ID列表 作为查询POi的索引列表
            //兴趣点的时候 先把当前的用户选中的POI从poiStorelist取出来
            $.each($scope.poiStoreList, function(index, item) {
              var cursite = $.inArray(item.id, copyCurPoiIds);
              // 选中ID 在当前得了列表中存在 拿出他的POI坐标信息
              // 同时从查找列表中删除当前这条索引
              if (cursite != -1) {
                grepResult.push(item.location.lng + ',' + item.location
                  .lat);
                delete copyCurPoiIds[cursite];
              }
            });
            // 如果copyCurPoiIds长度不为0 说明剩下的选中状态不在当前POIlist中
            //属于在其他页的时候 被选中的POI
            $.each($scope.areaCheckedGeoList['C3'], function(index, item) {
              var cursite = $.inArray(item.id, copyCurPoiIds);
              if (cursite != -1) {
                grepResult.push(item.lng + ',' + item.lat);
                delete copyCurPoiIds[cursite];
              }
            });
            judgeParams = {
              regions: grepResult.join(';'),
              radius: $scope.areaCheckedRadius['C3'],
              type: 'C3'
            };
            break;
          default:
            break;
        }

        getCircleCountUpdateJudgeMethod()(judgeParams).then(function() {
          // 未超过限制
          $scope.areaCheckedList[$scope.areaTypeChecked] =
            originSelectedItem;
          areaParamValidatedFunc();
        }, function(desc, errcode) {
          // 超过限制 添加失败
          //提示
          SweetAlert.swal({
            title: '添加失败',
            text: desc,
            confirmButtonColor: '#399eee',
            confirmButtonText: '确定'
          });
        });
      };
    };

    //接受其他设置中被选中的标签
    $scope.$on('UPDATE_FILTER_LABELS', function(e, checkedLabels) {
      validateTotalParamRequest({
        tagEntitys: checkedLabels
      });
    });

    //默认扩展倍数为0
    $scope.multipleNum = 0;
    //扩展配置
    $scope.multiples = {
      options: {
        range: 'min',
        max: 30,
        value: $scope.multipleNum,
        min: 0,
        step: 1
      }
    };

    //进行扩展
    $scope.updateMultipleNum = function(value) {
      $scope.multipleNum = value;
      validateTotalParamRequest({
        scale: value
      });
    };


    //点击下一步 跳转到第二步
    $scope.next = function() {

      $state.go('index.crowd.step2', {
        count: $scope.crowdCount,
        startdate: $scope.startDate,
        enddate: $scope.endDate
      });
    };
  }
]);


//标签Ctrl
lbiApp.controller('crowd.filterCtrl', [
  '$scope',
  '$state',
  'fetureLabels',
  'getTrades',
  function($scope, $state, fetureLabels, getTrades) {

    //普通标签
    fetureLabels.then(function(tags) {

      var allTag = tags[0];
      $scope.filterLabels = allTag['base'];

    });

    //行业标签
    getTrades.then(function(info) {
      $scope.tradeTag = info;
    });

    //选中标签
    $scope.checkedMylabels = {};
    $scope.inArray = $.inArray;

    //选择标签
    $scope.selectlabel = function(tagid, value, type) {

      //默认多选
      var tagtype = tagtype || 'checkbox';

      var arr = $scope.checkedMylabels[tagid] || [];

      if (tagtype == 'checkbox') {
        var index = -1;
        index = $.inArray(value, arr);

        index === -1 ? arr.push(value) : arr.splice(index, 1);

      } else if (tagtype == 'radio') {
        arr = [value];
      }


      $scope.checkedMylabels[tagid] = arr;
      //emit to parent contorller
      $scope.$emit('UPDATE_FILTER_LABELS', $scope.checkedMylabels);
      $scope.checkedCall && $scope.checkedCall({
        labels: $scope.checkedMylabels
      });
    };


    //跳转到二级标签页面
    $scope.redirectToSecondTag = function(tagid, tagtype, tagname) {

      $state.go('index.crowd.secondtag', {
        tagid: tagid,
        tagtype: tagtype,
        tags: ($scope.checkedMylabels[tagid] || []).join(',')
      });
    };

    $scope.$on('BROADCAST_CROWD_PARAMS', function(e, params) {
      $.each(params.tagEntitys, function($index, $item) {
        $scope.checkedMylabels[$index] = $item;
      });
    });

    $scope.$on('$stateChangeSuccess', function(e, tostate, toparams) {
      if (toparams['secondtags'] && toparams['secondtagid']) {
        $scope.checkedMylabels[toparams['secondtagid']] = toparams[
          'secondtags'].split(',');
        $scope.$emit('UPDATE_FILTER_LABELS', $scope.checkedMylabels);

      }
    });


  }
]);
