lbiApp.directive("slidebar",["safeApply",function(a){var b=function(b,c,d,e){var f=b.options||{};c.slider(f),c.on("slide",function(a,b){g(b.value)}),c.on("slidestop",function(c,d){a(b,function(){b.updateSlider&&b.updateSlider({value:d.value})})});var g=function(c){a(b,function(){e.$setViewValue(c)})}};return{restrict:"AC",scope:{options:"=",updateSlider:"&"},require:"ngModel",compile:function(){return{post:b}}}}]);