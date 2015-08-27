// 所有的类目
lbiApp.directive('allcat', ['lbiService','superCat',function(lbiService,superCat){
	// Runs during compile
	var link=function($scope,iElm,iAttrs){
		$scope.super=[];
		superCat.then(function(list){
			$scope.super=list;
		});

		$scope.checked_cat={};

		$scope.chooseCat=function(item){
			$scope.checked_cat=item;
		}

		$scope.getLevelData=(function(){
			var nowId='';
			return function(id,level){
				nowId=id;
				setTimeout(function(){
					if(nowId==id){
						$scope.requestLevelData(id,level);
					}
				},400);
			};
		})();

		$scope.requestLevelData=function(id,level){
			lbiService('get_categlorys',{
				categoryId:id
			}).then(function(list){
				$scope['level'+level]=list;

			});
		};


		$scope.click_confirm=function(){
			$scope.confirmcall({
				checkedItem:$scope.checked_cat
			})
		}

		$scope.click_cancel=function(){
			$scope.cancelcall();
		}



	}

	return {
		scope:{
			confirmcall:'&confirm',
			cancelcall:'&cancel'
		},
		templateUrl:'allcat.html',
		link: link
	};
}]);