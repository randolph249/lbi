var lbiApp = angular.module('lbiApp');
//获取memberId


//更新apply调用方法
lbiApp.factory('safeApply', ['$rootScope', function($rootScope) {
  return function($scope, fn) {
    var phase = $scope.$root && $scope.$root.$$phase;

    if (phase == '$apply' || phase == '$digest') {
      if (fn) {
        $scope.$eval(fn);
      }
    } else {
      if (fn) {
        $scope.$apply(fn);
      } else {
        $scope.$apply();
      }
    }
  };
}]);

lbiApp.factory('lbiService', [
  '$http',
  '$timeout',
  'userStatus',
  '$rootScope',
  '$q',
  function($http, $timeout, userStatus, $rootScope, $q) {

    var info = {},
      reqs = {
        circleList: '/lbi/bizArea/querybizAreaByPage', //获取商圈列表
        sysCirclelist: '/lbi/bizArea/querySysbizArea', //系统商圈列表
        delCircle: '/lbi/bizArea/delbizArea', //删除商圈
        addCircle: '/lbi/bizArea/addbizArea', //添加商圈
        getGids: '/lbi/tile/getGids', //获取gids
        getLegends: '/lbi/tile/getLegends', //获取瓦片图例
        getCurPoi: '/lbi/bizArea/queryById', //获取当前商圈的具体信息
        memberFileList: '/lbi/member/fileList', //获取会员文件信息
        getShopCount: '/lbi/member/getMemberFileCount', //获取线上淘宝店会员总数
        getLocation: '/lbi/baseInfo/getIpInfo', //获取当前用户所在城市
        get_categlorys: '/lbi/category/querySubCats', //通过parentID来查询child 类目列表
        get_brands: '/lbi/category/queryBrand', //通过一级类目ID来查询品牌列表
        addBaseInfo: '/lbi/baseInfo/addBaseInfo', //创建用户商圈和关注品牌 类目信息
        updateBrand: '/lbi/category/setbrand', //更新用户关注品牌
        updateCat: '/lbi/category/setcategory', //更新用户关注类目
        getFileInfo: '/lbi/member/getFileInfo', //获取当前商圈内的会员文件人数
        getfetureLabels: '/lbi/member/getTags', //获取用户标签
        getCrowdCount: '/lbi/crowd/getCount', //筛选人数 通过标签、商圈ID和会员文件ID
        getDistribeCount: '/lbi/crowd/cityDistribe', //获取城市下每个区县的数据
        getCount: '/lbi/tile/getCount', //会员模块筛选人数
        getTagDateRange: '/lbi/crowd/getTagEndDate', //创建营销人群有效时间区间
        createCrowd: '/lbi/crowd/createCrowd', //创建营销人群
        sign_agreement: '/lbi/firlogin/agreeItem', //签署协议接口
        getMemberMsg: '/lbi/member/getPortraits', //获取会员画像 通过商圈ID和会员文件ID
        getFavBrands: '/lbi/category/queryBrandByUser', //获取用户关注品牌ID列表
        getFavCats: '/lbi/category/queryCatsByUser', //获取用户关注的类目列表
        getRankOfArea: '/lbi/saleRank/getCatDistSort', //获取半年内小区类目排名
        getCatUndBrandSort: '/lbi/saleRank/getCatUndBrandSort', //获取半年内类目下品牌销售列表
        getRankOfCircleByNum: '/lbi/bizRank/getBizRankByNum', //获取指定城市的商圈排名
        getRankOfCircleByShop: '/lbi/bizRank/getBizRankByShop',
        getRankOfCircleByCat: '/lbi/bizRank/getBizRankByCategory',
        getRankOfCircleByBrand: '/lbi/bizRank/getBizRankByBrand',
        getFiles: '/lbi/brand/getBrandFile', //获取文件列表信息
        delShopFile: '/lbi/brand/deleteBrandFile', //删除上传店铺文件
        getPhysicalStoreList: '/lbi/brand/getRecordFileByPage', //获取实体店信息
        getCitylist: '/lbi/baseInfo/getProvinceCity', //获取城市列表信息
        getCitylistByFilter: '/lbi/baseInfo/getProvinceCityCount', //获取筛选城市列表信息
        judgeGidsLen: '/lbi/crowd/judgeGidsLen', //判断商圈gid数量是否超过两百
        queryMyPois: '/lbi/poitype/getuserpoitype', //查询我的兴趣点,
        removePoi: '/lbi/poitype/removePoiType', //删除POI
        addPoi: '/lbi/poitype/addPoiType', //添加POI
        recommendPois: '/lbi/poitype/queryhottypes', //推荐热点类型POi
        searchPois: '/lbi/poitype/querytypes', //搜索POI 结果
        print: '/lbi/brand/print', //打印
        gonePOIRank: '/lbi/gonePOI/gonePOIRank', //常去POI排名
        getActivitys: '/lbi/sds/getActivitys', //获取活动列表
        getEffectAnalysis: '/lbi/sds/getEffectAnalysis',
        getTrades: '/lbi/trade/getTrades', //获取行业信息
        getSecondSelectTag: '/lbi/trade/getSelects'
      };


    //处理Ajax请求流程
    function processHandler(name, accepts, type) {
      var deferred = $q.defer();

      if (!reqs.hasOwnProperty(name)) {
        deferred.reject('接口不存在');
        return deferred.promise;
      }

      var url = reqs[name],
        args = Array.prototype.splice.call(arguments, 1),
        arg_second = args[0],
        arg_third = args[1],
        params = {},
        reqType = arg_third || 'GET';

      //获取到memberId以后
      userStatus.then(function(userInfo) {

        //获取ID
        var memberId = userInfo.memberId;
        params = {
          memberId: memberId
        };

        //如果请求格式是 ('name:xxxx',{name:xianqing})
        if ($.type(arg_second) === 'object') {
          params = $.extend(arg_second, params);
        }
        if (reqType.toUpperCase() === 'POST') {
          $http({
            url: reqs[name],
            method: 'POST',
            data: $.param(params),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;chartset=utf-8'
            }
          }).success(function(res) {

            if (res.success) {
              deferred.resolve(res.info);

            } else {
              deferred.reject(res.desc, res.errorcode);

            }
            return false;
          });
        } else {

          $http({
            url: reqs[name],
            method: 'GET',
            params: params
          }).success(function(res) {

            // if (res.success || (res.hasOwnProperty('info') && res.info.length)) {
            //   deferred.resolve(res.info);
            //   return false;
            // }
            // deferred.reject(res.desc, res.errorcode);

            if (res.success && res.info.length !== 0) {
              deferred.resolve(res.info);
            } else {
              deferred.reject(res.desc, res.errorcode);
            }
          });
        }

      });
      return deferred.promise;
    }

    return processHandler;
  }
]);



//获取一级类目
lbiApp.factory('superCat', ['$q', 'lbiService', function($q, lbiService) {
  var deferred = $q.defer();
  lbiService('get_categlorys').then(function(info) {
    deferred.resolve(info)
  });
  return deferred.promise;
}]);


//格式转换
lbiApp.factory('formatwkt', [function() {
  //str="POLYGON((x y,x y))"
  var reg = /(\d{2,3}\.\d+\S.\d{2,3}\.\d+)/g;
  return function(str) {
    if ($.type(str) !== 'string' || !str.length) {
      return false;
    }

    var result = str.match(reg);

    if (result && result.length) {
      return result;
    }
    return "";
  }
}]);


//获取用户标签
lbiApp.factory('fetureLabels', ['lbiService', '$q', function(lbiService, $q) {
  var deferred = $q.defer();
  lbiService('getfetureLabels').then(function(info) {
    deferred.resolve(info);
  });
  return deferred.promise;
}]);


// 我关注的品牌
lbiApp.factory('myBrandResource', ['lbiService', '$q', function(lbiService, $q) {
  var deferred,
    urls = {
      query: 'getFavBrands',
      update: 'updateBrand'
    },
    myCat,
    updateRecord = false,
    isLock = false,
    reqQueue = [];

  var resolveFunc = function(deferred) {
    if (updateRecord) {
      deferred.resolve(myCat);
      var newDeferred = reqQueue.pop();
      if (newDeferred) {
        resolveFunc(newDeferred);
      }
    } else {
      isLock = true;
      lbiService(urls['query']).then(function(info) {
        updateRecord = true;
        myCat = info;
        deferred.resolve(info);
        isLock = false; //解锁
        var newDeferred = reqQueue.pop();
        if (newDeferred) {
          resolveFunc(newDeferred);
        }

      });
    }
  }

  var queryFunc = function() {

    deferred = $q.defer();
    if (isLock) {
      reqQueue.push(deferred)
    } else {
      resolveFunc(deferred)
    }
    return deferred.promise;
  };
  var updateFunc = function(params) {
    lbiService(urls['update'], params, 'POST').then(function() {
      updateRecord = true;
    });
  }

  return {
    query: queryFunc,
    update: updateFunc
  }
}]);


// 我关注的类目
// 当用户在一个页面同时发送多个相同请求(请求用户关注类目)
// 创建一个请求队列 在当前请求正在处理的时候 上锁 禁止发送同类请求 同时把同类请求放入到待处理队列中
// 当前请求成功以后 同类请求可以直接使用上次请求结果 而不用再一次发送同类请求
lbiApp.factory('myCatResource', ['lbiService', '$q', function(lbiService, $q) {
  var deferred,
    urls = {
      query: 'getFavCats',
      update: 'updateCat'
    },
    myCat,
    updateRecord = false,
    isLock = false,
    reqQueue = [];

  var resolveFunc = function(deferred) {
    if (updateRecord) {
      deferred.resolve(myCat);
      var newDeferred = reqQueue.pop();
      if (newDeferred) {
        resolveFunc(newDeferred);
      }
    } else {
      isLock = true; //上锁
      lbiService(urls['query']).then(function(info) {
        updateRecord = true;
        myCat = info;
        deferred.resolve(info);
        isLock = false; //解锁
        var newDeferred = reqQueue.pop();
        if (newDeferred) {
          resolveFunc(newDeferred);
        }

      });
    }
  }

  var queryFunc = function() {

    deferred = $q.defer();
    if (isLock) {
      reqQueue.push(deferred)
    } else {
      resolveFunc(deferred)
    }
    return deferred.promise;
  };
  var updateFunc = function(params) {
    lbiService(urls['update'], params, 'POST').then(function() {
      updateRecord = true;
    });
  }

  return {
    query: queryFunc,
    update: updateFunc
  }
}]);


//我的兴趣点
lbiApp.factory('myPoiResource', ['lbiService', '$q', function(lbiService, $q) {
  var pois = [],
    updateRecord = false,
    deferred,
    urls = {
      query: 'queryMyPois',
      add: 'addPoi',
      del: 'removePoi'
    };


  var queryFunc = function() {
    deferred = $q.defer();

    if (updateRecord) {
      deferred.resolve(pois);
    } else {
      lbiService(urls['query']).then(function(info) {
        updateRecord = true;
        pois = info;
        deferred.resolve(info)
      }, function() {
        deferred.reject();
      });
    }
    return deferred.promise;
  };

  var addFunc = function(params) {
    lbiService(urls['add'], params, 'POST').then(function() {
      updateRecord = false;
    });
  };
  //删除POI
  var delFunc = function(params) {
    lbiService(urls['del'], params, 'POST').then(function() {
      updateRecord = false;
    });
  }

  return {
    query: queryFunc,
    add: addFunc,
    del: delFunc
  }
}]);


//线下会员文件列表
lbiApp.factory('offlineListResource', ['lbiService', '$q', function(lbiService,
  $q) {
  var deferred,
    urls = {
      query: 'memberFileList'
    },
    offlineList,
    updateRecord = false,
    isLock = false,
    reqQueue = [];

  var resolveFunc = function(deferred) {
    if (updateRecord) {
      deferred.resolve(offlineList);
      var newDeferred = reqQueue.pop();
      if (newDeferred) {
        resolveFunc(newDeferred);
      }
    } else {
      isLock = true;
      lbiService(urls['query']).then(function(info) {
        updateRecord = true;
        offlineList = info;
        deferred.resolve(info);
        isLock = false; //解锁
        var newDeferred = reqQueue.pop();
        if (newDeferred) {
          resolveFunc(newDeferred);
        }

      });
    }
  }

  var queryFunc = function() {

    deferred = $q.defer();
    if (isLock) {
      reqQueue.push(deferred)
    } else {
      resolveFunc(deferred)
    }
    return deferred.promise;
  };

  return {
    query: queryFunc
  }
}]);

// 全国城市列表
lbiApp.factory('cityListResource', ['$q', 'lbiService', function($q, lbiService) {
  var deferred,
    urls = {
      query: 'getCitylist'
    },
    cityList,
    updateRecord = false,
    isLock = false,
    reqQueue = [];

  var resolveFunc = function(deferred) {
    if (updateRecord) {
      deferred.resolve(cityList);
      var newDeferred = reqQueue.pop();
      if (newDeferred) {
        resolveFunc(newDeferred);
      }
    } else {
      isLock = true;
      lbiService(urls['query']).then(function(info) {
        updateRecord = true;
        cityList = info;
        deferred.resolve(info);
        isLock = false; //解锁
        var newDeferred = reqQueue.pop();
        if (newDeferred) {
          resolveFunc(newDeferred);
        }

      });
    }
  }

  var queryFunc = function() {

    deferred = $q.defer();
    if (isLock) {
      reqQueue.push(deferred)
    } else {
      resolveFunc(deferred)
    }
    return deferred.promise;
  };

  return {
    query: queryFunc
  }
}]);


/**
 * [tagEnitySwitch 数据格式转换]
 * [原始数据{id:[value1:value2]},转化数据[{id:id,value:[value1,value2]}]]
 **/
lbiApp.factory('tagEnitySwitch', [function() {
  return function(originArr) {
    var myArr = originArr || {};
    var resultArr = [];
    $.each(myArr, function(index, item) {
      resultArr.push({
        id: index,
        value: item
      });
    });
    return JSON.stringify(resultArr);

  }
}]);

//获取网格图legend 默认发送size=600;如果返回的网格分层数组为1 继续发送size=1200
lbiApp.factory('getGridTileLegend', ['$q', 'lbiService', function($q,
  lbiService) {
  var query = function(params) {
    var deferred = $q.defer();
    lbiService('getLegends', params, 'POST').then(function(info) {
      if (info.length > 1) {
        return deferred.resolve({
          legends: info,
          size: 600
        });
      } else {
        return lbiService('getLegends', $.extend(params, {
          size: 1200
        }), 'POST')
      }
    }).then(function(info) {
      deferred.resolve({
        legends: info,
        size: 1200
      });
    });
    return deferred.promise;
  }
  return query;
}]);


lbiApp.factory('tileLegend', [function() {
  var tileColor = ["#eeea27", "#b1ce24", "#48a935", "#176a58", "#1d386f",
    "#522661", "#d72229"
  ]; //legend color 数组
  var rankColor = ["#eeea27", "#b1ce24", "#48a935", "#522661", "#d72229"]; //legend color 数组

  return function(legends, source) {
    var minValue = 0,
      newLegends = [],
      colors = source && source == "rank" ? rankColor : tileColor;
    for (var i = 0, len = legends.length; i < len; i++) {
      newLegends.push({
        min: minValue,
        max: legends[i],
        color: colors[i]
      });
      minValue = Number(legends[i]) + 1;
    }
    return newLegends;
  }
}]);


//获取线上淘宝店列表
lbiApp.factory('onlineShoplist', ['$q', '$http', function($q, $http) {
  var reg = /(g\.tbcdn\.cn\/mm|100\.67\.1\.96\/g\/mm)/,
    deferred = $q.defer(),
    url =
    'http://dmp.taobao.com/api/login/loginuserinfo?callback=JSON_CALLBACK',
    testDataSource = [{
      dataId: "1590050090",
      name: "英特尔品牌站",
      type: "BRAND_SITE"
    }, {
      dataId: "894685532",
      name: "小狗品牌站",
      type: "BRAND_SITE"
    }, {
      dataId: "20316",
      name: "Nestle/雀巢",
      type: "BRAND"
    }, {
      dataId: "10246",
      name: "Philips/飞利浦",
      type: "BRAND"
    }, {
      dataId: "11119",
      name: "Lenovo/联想",
      type: "BRAND"
    }, {
      dataId: "1916101543",
      name: "银泰百货杭州城西店",
      type: "O2O_BC"
    }],
    getShopData = function(callback) {
      //如果是daily环境或者预发环境拿正式数据
      //本地环境取测试数据
      if (reg.test(TCDN_HOST)) {
        $http.jsonp(url).success(function(res) {
          if (res.info.ok && res.data.empowers && res.data.empowers.length) {
            deferred.resolve(res.data.empowers);
          } else {
            deferred.reject();
          }
        });
      } else {
        deferred.resolve(testDataSource);
      }
    };
  getShopData();
  return deferred.promise;
}]);


//请求请求系统商圈位置信息
lbiApp.factory('querycircleByBatch', ['$q', 'lbiService', 'formatwkt', function(
  $q, lbiService, formatwkt) {
  var deferred, maxLen, results;
  var resolveFunc = function() {};
  var queryFunc = function(ids) {
    deferred = $q.defer();
    maxLen = ids.length;
    results = [];
    $.each(ids, function(index, sysId) {
      lbiService('getCurPoi', {
        id: sysId
      }).then(function(info) {
        // 如果是系统商圈
        var poiInfo = info[0];
        if (poiInfo.hasOwnProperty('wkt') && poiInfo.wkt.length) {
          results.push({
            wkt: formatwkt(poiInfo.wkt),
            id: sysId
          });
        } else {
          results.push({
            lng: poiInfo.x,
            lat: poiInfo.y,
            id: sysId,
            radius: poiInfo.radius
          });
        }
        if (results.length == maxLen) {
          deferred.resolve(results);
        }
      });
    });
    return deferred.promise;
  }
  return queryFunc;
}]);


//判断GID的长度是否超过两百
lbiApp.factory('judgeCircleGidsLen', ['lbiService', '$q', function(lbiService,
  $q) {
  var judge = function(params) {
    var deferred = $q.defer();
    lbiService('judgeGidsLen', params, 'POST').then(function(info) {
      deferred.resolve();
    }, function(desc, errorcode) {
      deferred.reject(desc, errorcode);
    });
    return deferred.promise;
  }
  return judge;
}]);

//判断商圈个数是否超过两百
lbiApp.factory('judgeCircleCountLen', ['lbiService', '$q', function(lbiService,
  $q) {
  var judge = function(params) {
    var deferred = $q.defer();


    switch (params.type) {
      case 'C0':
        var errormsg = "商圈个数过多,最多支持200个商圈";
        params.ids.split(',').length <= 200 ? deferred.resolve() :
          deferred.reject(errormsg);
        break;
      case 'C1':
        var errormsg = "商圈个数过多,最多支持200个商圈";

        params.ids.split(',').length <= 200 ? deferred.resolve() :
          deferred.reject(errormsg);
        break;
      case 'C2':
        var errormsg = "实体店个数过多,最多支持200个实体店";

        params.regions.split(';').length <= 200 ? deferred.resolve() :
          deferred.reject(errormsg);
        break;
      case 'C3':
        var errormsg = "POI个数过多,最多支持200个POI点";

        params.regions.split(';').length <= 200 ? deferred.resolve() :
          deferred.reject(errormsg);
        break;
      default:
        break;
    }
    return deferred.promise;
  };
  return judge;
}]);

// 获取当前城市下POi列表的分布
lbiApp.factory('queryPlaceBySearchPoi', ['$q', function($q) {
  var MSearch, deferred;
  AMap.service(["AMap.PlaceSearch"], function() {
    MSearch = new AMap.PlaceSearch({ //构造地点查询类
      pageSize: 30,
      pageIndex: 1,
      city: "010" //beijing
    });
  });

  var query = function(params) {
    deferred = $q.defer();
    MSearch.setCity(params.city);
    MSearch.setPageIndex(params.page || 1);
    MSearch.setPageSize(params.pagesize || 10);
    // MSearch.setType(params.type);
    MSearch.search(params.key, function(status, result) {
      if (status == 'complete' && result.info == 'OK') {
        var pois = result.poiList.pois,
          count = result.poiList.count,
          pageSize = result.poiList.pageSize;

        deferred.resolve({
          pois: pois,
          totalPage: Math.ceil(count / pageSize),
          count: count
        });
      } else {
        deferred.reject();
      }
    })
    return deferred.promise;
  };
  return query;
}]);

//批量搜索附近一公里之内的制定POI信息
lbiApp.factory('queryNearPoi', ['$q', function($q) {
  var query = function(key, center, radius, type) {
    var r = radius || 1000,
      deferred = $q.defer(),
      total = [],
      pageIndex = 1;


    AMap.service(["AMap.PlaceSearch"], function() {
      var MSearch = new AMap.PlaceSearch({ //构造地点查询类
        pageSize: 50,
        pageIndex: pageIndex,
        type: type
      });

      var getNearPois = function() {
        MSearch.searchNearBy(key, center, r, function(status,
          result) {
          //如果查询成功
          if (status == 'complete' && result.info == 'OK') {
            total = total.concat(result.poiList.pois);

            //超过50条数据
            if (total.length < result.poiList.count) {
              pageIndex = pageIndex + 1;
              MSearch.setPageIndex(pageIndex);
              getNearPois();
            } else {
              deferred.resolve({
                type: type,
                center: center,
                count: result.poiList.count,
                pois: total
              });
            }

          } else {
            deferred.resolve({
              type: type,
              center: center,
              count: 0,
              pois: []
            });
          }
        })
      };

      getNearPois();

    });
    return deferred.promise;
  };
  return query;
}]);

//批量查询
lbiApp.factory('queryNearPoiByBatch', ['$q', 'queryNearPoi', function($q,
  queryNearPoi) {
  var query = function(params) {
    var deferred = $q.defer();
    var locs = params.locs,
      keys = params.keys,
      queue = [];

    $.each(keys, function(index, item) {
      var key = item.key;
      var type = item.type;
      $.each(locs, function(i, loc) {
        var lnglats = loc.split(',');
        var center = new AMap.LngLat(lnglats[0], lnglats[1]);
        queue.push(queryNearPoi(key, center, 1000, type));
      });
    });
    $q.all(queue).then(function(data) {
      handlerData(data, deferred);
    });
    return deferred.promise;
  };
  // 最后将数据格式转化成
  // 'x,y':{
  //   062000:{
  //     count:,
  //     pois
  //   }
  // };
  var handlerData = function(data, deferred) {
    var results = {};


    $.each(data, function(index, item) {
      var lnglat = item.center;
      var lnglatkey = lnglat.getLng() + ',' + lnglat.getLat();
      results[lnglatkey] = results[lnglatkey] || {};

      results[lnglatkey][item.type] = item;
    });
    deferred.resolve(results);
  };

  return query;
}]);

// 查询区县
lbiApp.factory('queryDistrict', ['$q', function($q) {
  var district, deferred;
  AMap.service(["AMap.DistrictSearch"], function() {
    var opts = {
      subdistrict: 1, //返回下一级行政区
      extensions: 'all', //返回行政区边界坐标组等具体信息
      level: 'district' //查询行政级别为 市
    };

    //实例化DistrictSearch
    district = new AMap.DistrictSearch(opts);
  });
  var query = function(cityObj, myLevel) {
    deferred = $q.defer();
    var cityname = cityObj.cityname.replace(/\u5e02/, '');
    if ('北京上海天津重庆'.indexOf(cityname) != -1) {
      cityname += '市市辖区';
    }

    level = myLevel || 'city';
    district.setLevel(level);
    district.search(cityname, function(status, result) {
      if (status == 'complete' && result.info == 'OK') {
        // 如果请求的是市级别的
        if (level == 'city') {
          deferred.resolve(result.districtList[0].districtList)
        } else if (level == 'district' && result.districtList[0].boundaries
          .length) {
          var wkt = $.map(result.districtList[0].boundaries[0],
            function(item) {
              return item.lng + ' ' + item.lat;
            })
          deferred.resolve({
            wkt: wkt
          })
        }
      }
    });
    return deferred.promise;

  }
  return query;
}]);

//根据受众的查询条件获取对应的城市列表
lbiApp.factory('queryCityListByCrowdParams', ['$q', 'lbiService', function($q,
  lbiService) {
  return function(params) {
    var deferred = $q.defer();
    if (params.hasOwnProperty('flag')) {
      var flag = params.flag,
        apiname = flag == '2' ? 'getCitylist' : 'getCitylistByFilter',
        apitype = flag == '2' ? 'GET' : 'POST',
        reqParams = flag == '2' ? {} : params;

      lbiService(apiname, reqParams, apitype).then(function(cityList) {
        deferred.resolve(cityList);
      }, function(desc, errorcode) {
        deferred.reject(desc, errorcode);
      })
    } else {
      deferred.reject('参数传递错误', '');
    }
    return deferred.promise;
  }
}]);



//营销活动列表
lbiApp.factory('marketActiveList', ['userStatus', '$q', function(userStatus, $q) {
  var deferred = $q.defer();
  userStatus.then(function(userInfo) {
    //权限控制 只针对林氏木业做一个case
    if (userInfo.memberId == 83675) {
      deferred.resolve([{
        id: '123456',
        name: '林氏木业投放活动1'
      }]);
    } else {
      deferred.reject('没有投放活动', '');
    }
  });
  return deferred.promise;
}])


//
lbiApp.factory('getDateFormat', [function() {
  var formatDate = function(date) {
    var year, month, day;
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();

    return [year, month, day].join('-');
  };
  var getDate = function(date) {
    var today = (+new Date),
      resultDate;
    switch (date) {
      case 'yesterday':
        resultDate = new Date(today - 24 * 60 * 60 * 1000);
        break;
      case 'lastweek':
        resultDate = new Date(today - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        resultDate = new Date();
        break;
    }

    return formatDate(resultDate)

  };
  return getDate;
}]);


//获取行业信息
lbiApp.factory('getTrades', ['lbiService', '$q', function(lbiService, $q) {
  var deferred = $q.defer();
  lbiService('getTrades', {}, 'POST').then(function(info) {

    deferred.resolve(info);
    return false;
  });
  return deferred.promise;
}])
