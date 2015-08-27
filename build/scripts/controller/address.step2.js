lbiApp.controller("addr.step2Ctrl",["$scope","$state","lbiService","queryNearPoiByBatch","getGridTileLegend","tileLegend","tagEnitySwitch","SweetAlert","formatwkt","safeApply",function(a,b,c,d,e,f){var g,h,i={};a.$on("$stateChangeSuccess",function(b,c,d){a.cityname=d.city,a.districtname=d.district}),a.$on("BROADCAST_TILE_PARAMS",function(b,c){i=c,g=c.adcode,a.gridSize=c.size,h=c.districtcode,m()}),a.$on("BROADCAST_BOUND_PARAMS",function(b,c,d){a.bound=c,a.legend=d,j()});var j=function(){c("getLegends",i,"POST").then(function(b){a.originLegends=b,a.tileLegends=f(b)})};a.selectLegends=function(b){b.length?k(b):a.tileParams={}};var k=function(b){var d=$.extend({section:b.join(";")},i);c("getGids",d,"POST").then(function(b){a.tileParams={gids:b[0].gids,bound:a.bound,legend:a.legend}})};a.poilist={"060200":"便利店","060400":"超市","060101":"购物中心",150500:"地铁站",150200:"火车站",150100:"机场",150702:"公交站"},a.poiCheckedList=["060200","150500"],a.togglePoi=function(b){var c=$.inArray(b,a.poiCheckedList);-1==c?(a.poiCheckedList.length<3&&a.poiCheckedList.push(b),n(),q(b)):a.poiCheckedList.length>1&&a.poiCheckedList.splice(c,1)};var l=[],m=function(){c("getFiles",{},"POST").then(function(b){a.filename=b[0].title,a.fileid=b[0].id}).then(function(){return c("getPhysicalStoreList",{adcode:g,distcode:h,ismatch:1,fileid:a.fileid},"POST")}).then(function(b){l=b,a.storepage=1,a.storetotal=Math.ceil(b.length/3)})};a.storestatus="show",a.toggleStores=function(){return l.length?void("show"==a.storestatus?(a.storeiconlist=[],a.storestatus="hide"):(a.storestatus="show",a.storeiconlist=[].concat(a.storelist))):!1};var n=function(){d({locs:$.map(a.storelist,function(a){return a.x+","+a.y}),keys:$.map(a.poiCheckedList,function(b){return{key:a.poilist[b],type:b}})}).then(function(b){a.storeNearPoiList=b})};a.storepaging=function(b){a.storelist=l.slice(5*(b-1),5*b),"show"==a.storestatus&&(a.storeiconlist=[].concat(a.storelist)),n()};var o;a.getNearPoiCount=function(b){a.storeNearPoiByslice=[],a.storeNearPageIndex=1,o=b.pois,a.storeNearCircle={center:[b.center.getLng(),b.center.getLat()],radius:1e3,options:{strokeColor:"#fff",strokeWeight:4,strokeOpacity:1,fillColor:"#ffffff"}},o.length>50||p();var c=b.center.offset(1e3,0);a.storeNearTipLnglat=[{x:c.getLng(),y:c.getLat()}]};var p=function(){var b=o.slice(50*(a.storeNearPageIndex-1),50*a.storeNearPageIndex);a.storeNearPageIndex=Math.ceil(o.length/50)==a.storeNearPageIndex?1:a.storeNearPageIndex+1,a.storeNearPoiByslice=$.map(b,function(a){return a.x=a.location.getLng(),a.y=a.location.getLat(),a})};a.showNearPoileast50=function(){p()},a.targetPoilist=[],a.printparams=[],a.addTargetCircle=function(b){if(a.targetPoilist.length>10)return!1;var c={lng:b.lnglat.getLng(),lat:b.lnglat.getLat(),x:b.lnglat.getLng(),y:b.lnglat.getLat(),name:"目标区域"+(a.targetPoilist.length+1),status:"read",radius:1e3};d({locs:[b.lnglat.getLng()+","+b.lnglat.getLat()],keys:$.map(a.poiCheckedList,function(b){return{key:a.poilist[b],type:b}})}).then(function(b){c.relatepois=b[c.x+","+c.y],a.targetPoilist.push(c)})},a.$watch("targetPoilist",function(b){var c=[];c=$.map(b,function(a){var b={};return b.name=a.name,b.coord=a.x+","+a.y,b.radius=1e3,b}),a.printparams=$.param({fileid:a.fileid,jsonarray:JSON.stringify(c)})},!0);var q=function(b){return 0==a.targetPoilist.length?!1:void d({locs:$.map(a.targetPoilist,function(a){return a.x+","+a.y}),keys:[{key:a.poilist[b],type:b}]}).then(function(c){$.map(a.targetPoilist,function(a){return a.x+","+a.y}),$.each(a.targetPoilist,function(a,d){c[d.x+","+d.y]&&(d.relatepois[b]=c[d.x+","+d.y][b])})})};a.back=function(){b.go("index.address.step1")}}]);