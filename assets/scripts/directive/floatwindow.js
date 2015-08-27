
//下拉窗
lbiApp.directive('floatwindow', [function(){
	// Runs during compile
	return {
		scope: {
			title:'@',
			flag:"="
		},
		transclude:true,
		templateUrl:'floatwindow.html',
		link: function($scope, iElm, iAttrs, controller) {
			//判断是否有mask 
			var mask=$('.mask');

			var  parentCont=$(iAttrs.parentCont);

			if(parentCont.length){

				iElm.appendTo(parentCont)
			}



			if(!mask.length){
				mask=$('<div class="mask"></div>').appendTo('#rootContainer');
			}
			//保证iElm不会被遮住
			iElm.css('z-index',Number(mask.css('z-index'))+1);

			$scope.$watch("flag",function(n,o){
				var display=!!$scope.flag;
				iElm[$scope.flag?"slideDown":"slideUp"]('fast');
				mask[$scope.flag?"show":"hide"]();
			});

			//监听 如果directive被移除 删除mask 
			$scope.$on("$destroy",function(){
				mask.remove();
			});
		}
	};
}]);


