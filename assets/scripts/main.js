var TCDN_HOST = document.getElementById('circlejsurl').value,
  lbiApp = angular.module('lbiApp', [
    'oc.lazyLoad', //动态加载模块
    'ui.router', //路由模块
    'lbiHtmlTpl'
  ]);


//rap接口请求mockjsdata
lbiApp.run([function() {
  try {
    RAP && RAP.setPrefix('/mockjsdata/');
  } catch (e) {};
}]);


lbiApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
  //定义angular-typeahead 文件加载列表
  $ocLazyLoadProvider.config({
    modules: [{
      name: 'siyfion.sfTypeahead',
      files: [
        TCDN_HOST +
        '/components/typeahead/typeahead.jquery.min.js',
        TCDN_HOST +
        '/components/typeahead/handlebars-v2.0.0.js',
        TCDN_HOST +
        '/components/angular-typeahead/angular-typeahead.js'
      ]
    }]
  });


  //定义angular-alert文件加载列表
  $ocLazyLoadProvider.config({
    modules: [{
      name: 'oitozero.ngSweetAlert',
      files: [
        TCDN_HOST + '/components/angular-alert/sweet-alert.css',
        TCDN_HOST +
        '/components/angular-alert/sweet-alert.min.js',
        TCDN_HOST +
        '/components/angular-alert/SweetAlert.min.js'
      ]
    }]
  });
}]);

//定义路由
lbiApp.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$ocLazyLoadProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,
    $locationProvider) {

    //定义路由
    $stateProvider
    //法务页面
      .state('agree', {
        url: '/agree',
        controller: 'agreeCtrl',
        templateUrl: 'agree.html',
        resolve: {
          loadAlert: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load('oitozero.ngSweetAlert');
          }],
          loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              files: [
                TCDN_HOST + '/scripts/service/service.js'
              ]
            });
          }],
          loadMyCss: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              files: [
                TCDN_HOST + '/styles/agree.css'
              ]
            });
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/agree.js'
              ]
            });
          }]
        }
      })
      //父页面
      .state('index', {
        url: '/',
        controller: 'rootCtrl',
        templateUrl: 'root.html',
        resolve: {
          loadAlert: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load('oitozero.ngSweetAlert');
          }],
          loadCommonDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              files: [
                TCDN_HOST + '/scripts/directive/citymenu.js',
                TCDN_HOST + '/scripts/directive/amap.js',
                TCDN_HOST + '/scripts/directive/dropmenu.js'

              ]
            });
          }],
          loadTypeAhead: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load('siyfion.sfTypeahead');
          }],
          loadMyCss: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              files: [
                TCDN_HOST + '/styles/reset.css',
                TCDN_HOST + '/styles/common.css',
                'http://at.alicdn.com/t/font_1431335952_6726515.css'
              ]
            });
          }],
          loadMyFilter: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/filter/filter.js'
              ]
            });
          }],
          //加载服务
          loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/service/service.js'
              ]
            });
          }],
          //加载controller
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/root.js'
              ]
            });
          }]
        }
      })
      //初始化创建商圈和用户关注类目/品牌页面
      .state('index.create', {
        url: 'create',
        templateUrl: 'create.html',
        controller: 'createMemberInfoCtrl',
        resolve: {

          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [

                //directive:添加商圈directive
                TCDN_HOST +
                '/scripts/directive/createcircle.js',
                //jquery ui slider
                TCDN_HOST +
                '/components/jquery-ui/jquery-ui.min.js',
                TCDN_HOST + '/scripts/directive/slider.js',
                TCDN_HOST + '/scripts/directive/floatwindow.js',

                //directive 类目列表/品牌列表
                TCDN_HOST + '/scripts/directive/allcat.js',
                TCDN_HOST + '/scripts/directive/allbrand.js'
              ]
            });
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/create.js'
              ]
            });
          }]
        }
      })
      //会员模块使用页面
      .state('index.normal', {
        url: 'normal',
        templateUrl: 'normal.html',
        controller: 'normalUseCtrl',
        resolve: {
          loadACharts: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              files: [
                'http://g.tbcdn.cn/bui/acharts/1.0.15/acharts-min.js'
              ]
            });
          }],
          loadTile: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              files: [
                TCDN_HOST + '/scripts/directive/draw.js',
                TCDN_HOST + '/scripts/directive/math.js'
              ]
            });
          }],
          //加载directive
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/hovercard.js',
                TCDN_HOST + '/scripts/directive/membertags.js',
                TCDN_HOST + '/scripts/directive/scrollbar.js',
                TCDN_HOST +
                '/components/scrollbar/scrollbar.js',
                TCDN_HOST + '/styles/scrollbar.css',
                TCDN_HOST + '/scripts/directive/acharts.js',
                TCDN_HOST + '/scripts/directive/tilelegend.js',
                TCDN_HOST +
                '/scripts/directive/lbiscrollevent.js'
              ]
            });
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/normal.js'
              ]
            });
          }]
        }
      })
      //所有设置入口
      .state('index.set', {
        url: 'set',
        templateUrl: 'set.html',
        controller: 'mySetCtrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/set.js'
              ]
            });
          }],
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/floatwindow.js'
              ]
            })
          }]
        }
      })
      //我的商圈
      .state('index.set.circle', {
        url: '/circle?page',
        templateUrl: 'mycircle.html',
        controller: 'mySet.circleCtrl',
        resolve: {
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/page.js',
              ]
            })
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/mycircle.js'
              ]
            });
          }]
        }
      })
      //添加山泉
      .state('index.set.circle.add', {
        url: '/add',
        templateUrl: 'addcircle.html',
        controller: 'mySet.circle.addCtrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/scripts/controller/mycircle.set.js'

              ]
            })
          }],
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/components/jquery-ui/jquery-ui.min.js',
                TCDN_HOST + '/scripts/directive/slider.js',
                TCDN_HOST +
                '/scripts/directive/createcircle.js'
              ]
            })
          }]
        }
      })
      //我关注的类目和品牌
      .state('index.set.cat', {
        url: '/cat',
        templateUrl: 'mycat.html',
        controller: 'mySet.catCtrl',
        resolve: {
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/allcat.js',
                TCDN_HOST + '/scripts/directive/allbrand.js'
              ]
            })
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/mycat.js'
              ]
            })
          }]
        }
      })
      // 我的兴趣点
      .state('index.set.poi', {
        url: '/poi',
        templateUrl: 'mypoi.html',
        controller: 'mySet.poiCtrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/mypoi.js'
              ]
            })
          }]
        }
      })
      //我的店铺
      .state('index.set.shop', {
        url: '/shop',
        templateUrl: 'myshop.html',
        controller: 'mySet.shopCtrl',
        resolve: {
          loadUpload: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'angularFileUpload',
              files: [
                TCDN_HOST +
                '/components/angular-upload/angular-file-upload.min.js'
              ]
            })
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/myshop.js'
              ]
            });
          }]
        }
      })
      .state('index.crowd', {
        url: 'crowd',
        templateUrl: 'crowd.html',
        controller: 'createMarketCtrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/crowd.js'
              ]
            });
          }]
        }
      })
      .state('index.crowd.step1', {
        url: '/step1?secondtagid&secondtags',
        templateUrl: 'crowd.step1.html',
        controller: 'createMarket.step1Ctrl',
        resolve: {
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/membertags.js',
                TCDN_HOST + '/scripts/directive/scrollbar.js',
                TCDN_HOST +
                '/components/jquery-ui/jquery-ui.min.js',
                TCDN_HOST + '/scripts/directive/slider.js',
                TCDN_HOST +
                '/components/scrollbar/scrollbar.js',
                TCDN_HOST +
                '/scripts/directive/realtimecheck.js',
                TCDN_HOST + '/styles/scrollbar.css',

              ]
            })
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/scripts/controller/crowd.step1.js'
              ]
            })
          }]
        }
      })
      .state('index.crowd.step2', {
        url: '/step2?count&startdate&enddate',
        templateUrl: 'crowd.step2.html',
        controller: 'createMarket.step2Ctrl',
        resolve: {
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/components/jquery-ui/jquery-ui.min.js',
                TCDN_HOST + '/scripts/directive/datepicker.js'
              ]
            })
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/scripts/controller/crowd.step2.js'

              ]
            })
          }]
        }
      })
      .state('index.crowd.secondtag', {
        url: '/secondtag?tagid&tagtype&tags',
        templateUrl: 'crowd.secondtag.html',
        controller: 'createMarket.secondtagCtrl',
        resolve: {
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/floatwindow.js'
              ]
            })
          }],
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/scripts/controller/crowd.secondtag.js'

              ]
            })
          }]
        }
      })
      .state('index.address', {
        url: 'address',
        templateUrl: 'address.html',
        controller: 'addrCtrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/address.js'
              ]
            })
          }],
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/tilelegend.js',
                TCDN_HOST + '/scripts/directive/membertags.js',
                TCDN_HOST + '/scripts/directive/draw.js',
                TCDN_HOST + '/scripts/directive/math.js',

              ]
            })
          }]
        }
      })
      .state('index.address.step1', {
        url: '/step1',
        templateUrl: 'address.step1.html',
        controller: 'addr.step1Ctrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/scripts/controller/address.step1.js'
              ]
            })
          }],
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {

            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/directive/scrollbar.js',
                TCDN_HOST +
                '/components/scrollbar/scrollbar.js',
                TCDN_HOST + '/styles/scrollbar.css'
              ]
            })
          }]
        }
      })

    //"{"size":600,"districtcode":"330109","datatype":"C5","flag":"1","tagEntitys":"[{\"id\":\"110063\",\"value\":[\"69002509\"]},{\"id\":\"112706\",\"value\":[\"330109\"]}]","adcode":"330100","usershopid":"69002509","fileId":"339"}"
    .state('index.address.step2', {
        url: '/step2?city&district',
        templateUrl: 'address.step2.html',
        controller: 'addr.step2Ctrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/scripts/controller/address.step2.js'
              ]
            })
          }]
        }
      })
      //营销效果
      .state('index.effect', {
        url: 'effect',
        templateUrl: 'effect.html',
        controller: 'effectCtrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST + '/scripts/controller/effect.js'
              ]
            })
          }]
        }
      })
      .state('index.effect.analy', {
        url: '/analy?id&startdate&enddate',
        templateUrl: 'effect.analy.html',
        controller: 'effect.analyCtrl',
        resolve: {
          loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                TCDN_HOST +
                '/scripts/controller/effect.analy.js',
              ]
            })
          }],
          loadMyDirective: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'lbiApp',
              files: [
                'http://g.tbcdn.cn/bui/acharts/1.0.15/acharts-min.js',
                TCDN_HOST + '/scripts/directive/acharts.js',
                TCDN_HOST +
                '/components/jquery-ui/jquery-ui.min.js',
                TCDN_HOST + '/scripts/directive/datepicker.js'
              ]
            })
          }]
        }
      });


    //默认跳转到normal page
    $urlRouterProvider.otherwise('/normal');
  }
]);


/**更新httpprovider content-type默认设置
 * 默认的post请求 content-type：application/json
 * 修改为content-type:application/x-www-form-urlencoded
 */
/**调用rap服务设置
 * 本地开发的时候 默认请求rap接口
 */
lbiApp.config(['$httpProvider', function($httpProvider) {
  var reg = /(g\.tbcdn\.cn\/mm|100\.67\.1\.96\/g\/mm)/;

  //如果是daily环境或者预发环境 什么都不做
  if (reg.test(TCDN_HOST)) {
    return false;
  }

  var interceptor = {
    request: function(config) {
      var url = config.url;
      var urls = JSON.stringify(RAP.getWhiteList());
      if (urls.indexOf(url) != -1) {
        config.url = 'http://rap.alibaba-inc.com/mockjsdata/535' +
          url;
      }
      return config;
    }
  };
  $httpProvider.interceptors.push(function() {
    return interceptor;
  });
}]);

//获取meberId和用户当前设置状态
lbiApp.factory('userStatus', ['$q', '$http', function($q, $http) {
  var memberId,
    isAgree,
    isExistCircle,
    deferred = $q.defer(),
    queryUserStatus = function() {
      $http({
        url: '/lbi/firlogin/checkFirlogin',
      }).then(function(res) {
        if (res.success === false) {
          return deferred.reject('请求失败');
        }
        var info = res.data.info[0];
        memberId = info.userInfo.memberId;
        isAgree = info.isAgree;
        isExistCircle = info.isExistCircle;
        deferred.resolve({
          memberId: memberId,
          isAgree: isAgree,
          isExistCircle: isExistCircle
        });
        return false;
      });
    };

  queryUserStatus();
  return deferred.promise;
}]);


//根据用户状态跳转路由
lbiApp.run(['$state', 'userStatus', '$rootScope', function($state, userStatus,
  $rootScope) {
  userStatus.then(function(status) {
    if (status.isAgree == '0') {
      $state.go('agree')
    }
  });
  return false;
}]);
