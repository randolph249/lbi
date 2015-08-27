var TCDN_HOST=document.getElementById("circlejsurl").value,lbiApp=angular.module("lbiApp",["oc.lazyLoad","ui.router","lbiHtmlTpl"]);lbiApp.run([function(){try{RAP&&RAP.setPrefix("/mockjsdata/")}catch(a){}}]),lbiApp.config(["$ocLazyLoadProvider",function(a){a.config({modules:[{name:"siyfion.sfTypeahead",files:[TCDN_HOST+"/components/typeahead/typeahead.jquery.min.js",TCDN_HOST+"/components/typeahead/handlebars-v2.0.0.js",TCDN_HOST+"/components/angular-typeahead/angular-typeahead.js"]}]}),a.config({modules:[{name:"oitozero.ngSweetAlert",files:[TCDN_HOST+"/components/angular-alert/sweet-alert.css",TCDN_HOST+"/components/angular-alert/sweet-alert.min.js",TCDN_HOST+"/components/angular-alert/SweetAlert.min.js"]}]})}]),lbiApp.config(["$stateProvider","$urlRouterProvider","$ocLazyLoadProvider","$locationProvider",function(a,b){a.state("agree",{url:"/agree",controller:"agreeCtrl",templateUrl:"agree.html",resolve:{loadAlert:["$ocLazyLoad",function(a){return a.load("oitozero.ngSweetAlert")}],loadMyService:["$ocLazyLoad",function(a){return a.load({files:[TCDN_HOST+"/scripts/service/service.js"]})}],loadMyCss:["$ocLazyLoad",function(a){return a.load({files:[TCDN_HOST+"/styles/agree.css"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/agree.js"]})}]}}).state("index",{url:"/",controller:"rootCtrl",templateUrl:"root.html",resolve:{loadAlert:["$ocLazyLoad",function(a){return a.load("oitozero.ngSweetAlert")}],loadCommonDirective:["$ocLazyLoad",function(a){return a.load({files:[TCDN_HOST+"/scripts/directive/citymenu.js",TCDN_HOST+"/scripts/directive/amap.js",TCDN_HOST+"/scripts/directive/dropmenu.js"]})}],loadTypeAhead:["$ocLazyLoad",function(a){return a.load("siyfion.sfTypeahead")}],loadMyCss:["$ocLazyLoad",function(a){return a.load({files:[TCDN_HOST+"/styles/reset.css",TCDN_HOST+"/styles/common.css","http://at.alicdn.com/t/font_1431335952_6726515.css"]})}],loadMyFilter:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/filter/filter.js"]})}],loadMyService:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/service/service.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/root.js"]})}]}}).state("index.create",{url:"create",templateUrl:"create.html",controller:"createMemberInfoCtrl",resolve:{loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/createcircle.js",TCDN_HOST+"/components/jquery-ui/jquery-ui.min.js",TCDN_HOST+"/scripts/directive/slider.js",TCDN_HOST+"/scripts/directive/floatwindow.js",TCDN_HOST+"/scripts/directive/allcat.js",TCDN_HOST+"/scripts/directive/allbrand.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/create.js"]})}]}}).state("index.normal",{url:"normal",templateUrl:"normal.html",controller:"normalUseCtrl",resolve:{loadACharts:["$ocLazyLoad",function(a){return a.load({files:["http://g.tbcdn.cn/bui/acharts/1.0.15/acharts-min.js"]})}],loadTile:["$ocLazyLoad",function(a){return a.load({files:[TCDN_HOST+"/scripts/directive/draw.js",TCDN_HOST+"/scripts/directive/math.js"]})}],loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/hovercard.js",TCDN_HOST+"/scripts/directive/membertags.js",TCDN_HOST+"/scripts/directive/scrollbar.js",TCDN_HOST+"/components/scrollbar/scrollbar.js",TCDN_HOST+"/styles/scrollbar.css",TCDN_HOST+"/scripts/directive/acharts.js",TCDN_HOST+"/scripts/directive/tilelegend.js",TCDN_HOST+"/scripts/directive/lbiscrollevent.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/normal.js"]})}]}}).state("index.set",{url:"set",templateUrl:"set.html",controller:"mySetCtrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/set.js"]})}],loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/floatwindow.js"]})}]}}).state("index.set.circle",{url:"/circle?page",templateUrl:"mycircle.html",controller:"mySet.circleCtrl",resolve:{loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/page.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/mycircle.js"]})}]}}).state("index.set.circle.add",{url:"/add",templateUrl:"addcircle.html",controller:"mySet.circle.addCtrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/mycircle.set.js"]})}],loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/components/jquery-ui/jquery-ui.min.js",TCDN_HOST+"/scripts/directive/slider.js",TCDN_HOST+"/scripts/directive/createcircle.js"]})}]}}).state("index.set.cat",{url:"/cat",templateUrl:"mycat.html",controller:"mySet.catCtrl",resolve:{loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/allcat.js",TCDN_HOST+"/scripts/directive/allbrand.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/mycat.js"]})}]}}).state("index.set.poi",{url:"/poi",templateUrl:"mypoi.html",controller:"mySet.poiCtrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/mypoi.js"]})}]}}).state("index.set.shop",{url:"/shop",templateUrl:"myshop.html",controller:"mySet.shopCtrl",resolve:{loadUpload:["$ocLazyLoad",function(a){return a.load({name:"angularFileUpload",files:[TCDN_HOST+"/components/angular-upload/angular-file-upload.min.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/myshop.js"]})}]}}).state("index.crowd",{url:"crowd",templateUrl:"crowd.html",controller:"createMarketCtrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/crowd.js"]})}]}}).state("index.crowd.step1",{url:"/step1?secondtagid&secondtags",templateUrl:"crowd.step1.html",controller:"createMarket.step1Ctrl",resolve:{loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/membertags.js",TCDN_HOST+"/scripts/directive/scrollbar.js",TCDN_HOST+"/components/jquery-ui/jquery-ui.min.js",TCDN_HOST+"/scripts/directive/slider.js",TCDN_HOST+"/components/scrollbar/scrollbar.js",TCDN_HOST+"/scripts/directive/realtimecheck.js",TCDN_HOST+"/styles/scrollbar.css"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/crowd.step1.js"]})}]}}).state("index.crowd.step2",{url:"/step2?count&startdate&enddate",templateUrl:"crowd.step2.html",controller:"createMarket.step2Ctrl",resolve:{loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/components/jquery-ui/jquery-ui.min.js",TCDN_HOST+"/scripts/directive/datepicker.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/crowd.step2.js"]})}]}}).state("index.crowd.secondtag",{url:"/secondtag?tagid&tagtype&tags",templateUrl:"crowd.secondtag.html",controller:"createMarket.secondtagCtrl",resolve:{loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/floatwindow.js"]})}],loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/crowd.secondtag.js"]})}]}}).state("index.address",{url:"address",templateUrl:"address.html",controller:"addrCtrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/address.js"]})}],loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/tilelegend.js",TCDN_HOST+"/scripts/directive/membertags.js",TCDN_HOST+"/scripts/directive/draw.js",TCDN_HOST+"/scripts/directive/math.js"]})}]}}).state("index.address.step1",{url:"/step1",templateUrl:"address.step1.html",controller:"addr.step1Ctrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/address.step1.js"]})}],loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/directive/scrollbar.js",TCDN_HOST+"/components/scrollbar/scrollbar.js",TCDN_HOST+"/styles/scrollbar.css"]})}]}}).state("index.address.step2",{url:"/step2?city&district",templateUrl:"address.step2.html",controller:"addr.step2Ctrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/address.step2.js"]})}]}}).state("index.effect",{url:"effect",templateUrl:"effect.html",controller:"effectCtrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/effect.js"]})}]}}).state("index.effect.analy",{url:"/analy?id&startdate&enddate",templateUrl:"effect.analy.html",controller:"effect.analyCtrl",resolve:{loadMyCtrl:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:[TCDN_HOST+"/scripts/controller/effect.analy.js"]})}],loadMyDirective:["$ocLazyLoad",function(a){return a.load({name:"lbiApp",files:["http://g.tbcdn.cn/bui/acharts/1.0.15/acharts-min.js",TCDN_HOST+"/scripts/directive/acharts.js",TCDN_HOST+"/components/jquery-ui/jquery-ui.min.js",TCDN_HOST+"/scripts/directive/datepicker.js"]})}]}}),b.otherwise("/normal")}]),lbiApp.config(["$httpProvider",function(a){var b=/(g\.tbcdn\.cn\/mm|100\.67\.1\.96\/g\/mm)/;if(b.test(TCDN_HOST))return!1;var c={request:function(a){var b=a.url,c=JSON.stringify(RAP.getWhiteList());return-1!=c.indexOf(b)&&(a.url="http://rap.alibaba-inc.com/mockjsdata/535"+b),a}};a.interceptors.push(function(){return c})}]),lbiApp.factory("userStatus",["$q","$http",function(a,b){var c,d,e,f=a.defer(),g=function(){b({url:"/lbi/firlogin/checkFirlogin"}).then(function(a){if(a.success===!1)return f.reject("请求失败");var b=a.data.info[0];return c=b.userInfo.memberId,d=b.isAgree,e=b.isExistCircle,f.resolve({memberId:c,isAgree:d,isExistCircle:e}),!1})};return g(),f.promise}]),lbiApp.run(["$state","userStatus","$rootScope",function(a,b){return b.then(function(b){"0"==b.isAgree&&a.go("agree")}),!1}]);