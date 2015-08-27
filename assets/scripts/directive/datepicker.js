//封装jQuery plugin datepicker
lbiApp.directive('datepicker', [function(){
	// Runs during compile
	return {
		scope:{
			'startDate':'@',
			'endDate':'@',
			'options':"@"
		},
		require:"?ngModel",
		link: function($scope, iElm, iAttrs, ngModel) {



			var reg=/\d{4}(-|\/)\d{1,2}(-|\/)\d{1,2}/;
			var options;
			if($.type($scope.options)=='string'){
				options=JSON.parse($scope.options)
			}
			options=$.extend(true,{
				numberOfMonths:isNaN(iAttrs.numberOfMonths)?2:Number(iAttrs.numberOfMonths),
				dateFormat:'yy-mm-dd'
			},options);

			iElm.datepicker(options);

			var startFunc=$scope.$watch('startDate',function(e){
				if(!reg.test($scope.startDate)){
					return false;
				}
				iElm.datepicker("option", "minDate",new Date($scope.startDate));
			});

			var endFunc=$scope.$watch('endDate',function(e){
				if(!reg.test($scope.endDate)){
					return false;
				}
				iElm.datepicker("option", "maxDate",new Date($scope.endDate));
			});


			$scope.$watch(function(){
				return ngModel.$modelValue;
			},function(v){
				iElm.datepicker('setDate',ngModel.$viewValue);
			})


		}
	};
}]);