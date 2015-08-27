//模拟滚动条
lbiApp.directive('perfectScrollbar', [function() {
  // Runs during compile
  return {
    scope: {},
    link: function($scope, iElm, iAttrs) {
      var child = iElm.children(),
        callee = arguments.callee;
      if (child.height()) {
        iElm.perfectScrollbar();
      } else {
        setTimeout(function() {
          callee($scope, iElm, iAttrs)
        }, 100);
        return false;
      }
    }
  };
}]);

lbiApp.directive('headScroll', ['safeApply',function(safeApply) {
  var judgeScroll = function($scope, iHeight, iTop) {
		var scrollTop = $(window).scrollTop();
    safeApply($scope, function() {
      if (scrollTop >= iHeight + iTop) {
        $scope.swclass = true;
      } else {
        $scope.swclass = false
      }
    })
  };
  return {
    link: function($scope, iElm, iAttrs) {
      var bufferHeight=isNaN(iAttrs.bufferHeight)?120:Number(iAttrs.bufferHeight);
      var iHeight = $(iElm).outerHeight()+bufferHeight,
        iTop = $(iElm).offset().top,
				timer;


      $(window).bind('scroll.headScroll', function(e) {

				if(timer){
					clearTimeout(timer);
				}

				timer=setTimeout(function(){
					judgeScroll($scope, iHeight, iTop);
				},100);
      });

      $scope.$on('$destroy', function() {
        $(window).unbind('scroll.headScroll');
      });
    }
  }
}]);
