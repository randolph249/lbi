var lbiApp=angular.module('lbiApp');



//设置页面的controller
lbiApp.controller('mySetCtrl', ['$scope','$state', function($scope,$state){

	//跳转到对应的子页面
	$scope.redirecToSubRouter=function(routername){
		$state.go('index.set.'+routername);
	}

	//监听URl变化
	$scope.$on('$stateChangeSuccess',function(e,toState,toParams,fromState,fromParams){
		$scope.curtab=toState.name.replace('index.set.','');
	});
}]);