lbiApp.directive("hoverCard",[function(){return{link:function(a,b,c){var d=c.hoverclass||"member_card_hover";b.hover(function(){b.addClass(d)},function(){b.removeClass(d)})}}}]);