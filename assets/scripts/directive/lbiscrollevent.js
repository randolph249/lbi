// 
lbiApp.directive('lbiScrollEvent', ['safeApply',function(safeApply){


	var winVisibleHei=$(window).height();

	$(window).resize(function(){
		winVisibleHei=$(window).height();
	})


	var link=function($scope,iElm,iAttrs){
		var iElmOffsetTop=$(iElm).offset().top;
		$(document).scroll(function(){
			var docSTop=$(document).scrollTop();
			safeApply($scope,function(){
				$scope.lbiScrollEvent({
					flag:(winVisibleHei+docSTop)>iElmOffsetTop
				});
			});
		});
	}

	// Runs during compile
	return {
		scope:{
			lbiScrollEvent:'&'
		},
		link: link
	};
}]);