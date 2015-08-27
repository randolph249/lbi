lbiApp.controller('rootCtrl', ['$scope', '$state', 'userStatus', function(
	$scope, $state, userStatus) {
	$scope.issetpage = false;
	var backRoute = 'index.normal';
	var backParam = {};
	//判断router 下 设置和会员模块可以点击吗？
	//默认在index.create的时候 任何跳转按钮能点击root.js



	//导航列表
	$scope.navs = [{
		text: '人群分析',
		name: 'normal'
	}, {
		text: '新建营销人群',
		name: 'crowd'
	}, {
		text: '选址分析',
		name: 'address'
	}, {
		text: '营销效果',
		name: 'effect'
	}];



	// var validateFlag=function(){
	// 	return $scope.clickflag=$state.current.name!=='index.create'?true:false;
	// }

	// $scope.redirectoset=function(){
	// 	// if(!validateFlag()){
	// 	// 	return  false;
	// 	// }


	// 	if($state.current.name=='index.set'){
	// 		$state.go(backRoute,backParam);
	// 	}else{
	// 		backParam=$state.params;
	// 		backRoute=$state.current.name;//记录当前路由 点击设置的时候 回退
	// 		$state.go('index.set.circle');
	// 	}
	// 	return false;
	// };

	$scope.redirect = function(pagename) {
		// if(!validateFlag()){
		// 	return  false;
		// }
		$state.go(['index', pagename].join('.'));
	}

	//判断用户当前路由是否是设置页面 切换设置按钮状态
	$scope.$on("$stateChangeSuccess", function(e, toState) {
		if (toState.name == 'index') {
			$state.go('index.normal');
			return false;
		}

		$scope.curpage = toState.name.replace('index.', '');
		return false;
	});
}]);
