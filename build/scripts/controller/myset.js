var lbiApp=angular.module("lbiApp");lbiApp.controller("mySetCtrl",["$scope",function(a){a.displayCatList=!1,a.displayBrandList=!1,a.displayAddcircle=!1,a.$on("UPDATE_CATLISTDISPLAY",function(b,c){a.displayCatList=c}),a.$on("UPDATE_BRANDLISTDISPLAY",function(b,c){a.displayBrandList=c}),a.$on("UPDATE_ADDCIRCLE",function(b,c){a.displayAddcircle=c})}]),lbiApp.controller("myCircleList",["$scope","lbiService","broadcastBetweenCtrls",function(a,b,c){function d(c){b("circleList",function(b){b.success(function(b){a.circlelist=b.info[0].bizAreaInfo,a.pageNo=b.info[0].pageNo,a.totalCount=b.info[0].totalCount,a.pageSize=10})},{pageNo:c})}a.DoCtrlPagingAct=function(b,c){a.pageNo=c},c.on("ADDCIRCLE_SUCCESSED",function(){a.timeStamp=(new Date).getTime()}),a.timeStamp=(new Date).getTime(),a.$watch("timeStamp+pageNo",function(){d(a.pageNo)}),a.delItem=function(c,d){b("delCircle",function(b){b.success(function(b){b.success&&(a.circlelist.splice(d,1),a.timeStamp=(new Date).getTime(),alert("删除成功！"))})},{id:c},"POST")},a.showAddCircle=function(){a.$emit("UPDATE_ADDCIRCLE",!0)},a.$on("$destroy",function(){c.off("ADDCIRCLE_SUCCESSED")})}]),lbiApp.controller("addMyCircleCtrl",["$scope","lbiService","safeApply","broadcastBetweenCtrls",function(a,b,c,d){var e=function(b){var c=a.citylist,d=-1;return $.each(c,function(a,c){return c.cityname===b?d=a:void 0}),-1===d?(e(a.defaultcity),!1):(a.curPoiMsg.city=c[d].cityname,a.curPoiMsg.index=d,a.curPoiMsg.poiname=c[d].poiname,a.curPoiMsg.citycode=c[d].citycode,void(a.curPoiMsg.lnglat=[c[d].lng,c[d].lat]))},f=function(){return a.permissionflag=""==a.circletype?!1:""==$.trim(a.name)?!1:a.radius&&a.curPoiMsg.lnglat&&a.curPoiMsg.lnglat.length?!0:!1};a.permissionflag=!1,a.defaultcity=DEFAULT_CITY,a.citylist=CITY_LIST,a.citycodelist=[],a.curPoiMsg={index:0,cityname:"",poiname:"",lnglat:[]},b("getLocation",function(a){a.success(function(a){var b=a.info[0].city.replace(/\d+,/,"").replace(/^\s+|\s+$/g,"");e(b)})}),a.$watch("curPoiMsg.city",function(b,c){b!==c&&e(a.curPoiMsg.city)}),a.typeahead={},a.typeahead.datasets={name:"states",source:function(b,c){var d=a.$on("UPDATE_DATASOURCE",function(a,b){c(b),"function"===$.type(d)&&d()});return!1},displayKey:"name"},a.typeahead.options={highlight:!0},a.$on("typeahead:selected",function(b,d){c(a,function(){a.curPoiMsg.poiname=d.name,a.curPoiMsg.lnglat=[d.location.lng,d.location.lat]})}),a.radius=3e3,a.slidebar={options:{range:"min",value:a.radius,min:0,max:7e3,step:100}},a.$watch("name",function(){f()}),a.addCircleRequest=function(){var c={circletype:a.circletype,name:a.name,radius:a.radius,city:a.curPoiMsg.city,x:a.curPoiMsg.lnglat[0],y:a.curPoiMsg.lnglat[1]};b("addCircle",function(b){b.success(function(b){b.success?(d.trigger("ADDCIRCLE_SUCCESSED"),a.cancelAddCircle(),alert("商圈添加成功!")):alert("商圈添加失败，请重新添加！")})},c,"POST")},a.cancelAddCircle=function(){a.$emit("UPDATE_ADDCIRCLE",!1)}}]),lbiApp.controller("myCatBrandCtrl",["$scope","lbiService","commonDataShare","broadcastBetweenCtrls",function(a,b,c,d){function e(a){b("updateCat",function(a){a.success(function(){})},{categoryId:a},"POST")}function f(a,c){b("updateBrand",function(a){a.success(function(){})},{categoryid:a,brandid:c},"POST")}b("getFavBrands",function(b){b.success(function(b){var c=b.info;a.myBrands={brand_full_name:c[0].brand_full_name,brandcatid:c[0].category_id,brand_id:c[0].brand_id,brand_name:c[0].brand_name}})}),b("getFavCats",function(b){b.success(function(b){var c=b.info;a.myCats={category_full_name:c[0].category_full_name,name:c[0].name,id:c[0].id}})}),a.showCatList=function(){a.$emit("UPDATE_CATLISTDISPLAY",!0)},a.showBrandList=function(){a.$emit("UPDATE_BRANDLISTDISPLAY",!0)},d.on("BROADCAST_CHECKED_CAT",function(b){a.myCats={category_full_name:b.category_full_name,name:b.name,id:b.id},e(b.id)}),d.on("BROADCAST_CHECKED_BRAND",function(b){a.myBrands={brand_full_name:"一级类目~"+b.brandcatname+">>"+b.brand_name,brandcatid:b.brandcatid,brand_id:b.brand_id,brand_name:b.brand_name},f(b.brandcatid,b.brand_id)}),a.$on("$destroy",function(){d.off(["BROADCAST_CHECKED_CAT","BROADCAST_CHECKED_BRAND"])})}]);