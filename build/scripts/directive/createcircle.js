lbiApp.directive("creatcircle",["safeApply",function(a){var b=function(b){b.poiname="";var c;b.checkcity=function(a){b.cityname=a.cityname,c=a.poiname,b.poiname=a.poiname,b.citycode=a.citycode,b.lng=a.poi_x,b.lat=a.poi_y,b.center=[a.poi_x,a.poi_y]},b.typeahead={},b.typeahead.datasets={displayKey:"name",name:"states",source:function(a,c){var d=b.$on("UPDATE_DATASOURCE",function(a,b){c(b),"function"==$.type(d)&&d()});return!1},templates:{empty:['<div class="search-empty">',"未找到对应地址信息","</div>"].join("\n"),suggestion:Handlebars.compile(['<div class="search-result">','<p class="search-result-poiname">{{name}}</p>','<p class="search-result-address">','<i class="iconfont icon-location"></i>',"{{address}}","</p>","</div>"].join(""))}},b.typeahead.options={minLength:2,highlight:!0},b.$on("typeahead:selected",function(d,e){a(b,function(){c=e.name,b.poiname=e.name,b.lng=e.location.lng,b.lat=e.location.lat,b.center=[e.location.lng,e.location.lat]})}),b.$on("typeahead:closed",function(){b.poiname!==c&&(b.poiname="")}),b.isOk=function(){return $.trim(b.name).length&&b.poiname==c?!1:!0},b.radius=3e3,b.slidebar={options:{range:"min",value:b.radius,min:0,max:7e3,step:100}},b.updateRadius=function(a){b.radius=a},b.emitToParent=function(){b.confirmcall({params:{circletype:b.circletype,name:b.name,radius:b.radius,citycode:b.citycode,city:b.cityname,x:b.center[0],y:b.center[1]}})},b.cancel=function(){b.cancelcall()}};return{templateUrl:"createcircle.html",scope:{confirmcall:"&",cancelcall:"&"},compile:function(){return{pre:b}}}}]);