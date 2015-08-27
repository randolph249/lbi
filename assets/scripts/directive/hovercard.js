//鼠标换过卡片 卡片hover blue
lbiApp.directive('hoverCard', [function(){
	return {
		link: function($scope, iElm, iAttrs) {
			var cls=iAttrs.hoverclass||'member_card_hover';
			iElm.hover(function() {
				/* Stuff to do when the mouse enters the element */
				iElm.addClass(cls);
			}, function() {
				/* Stuff to do when the mouse leaves the element */
				iElm.removeClass(cls);
			});
		}
	};
}]);