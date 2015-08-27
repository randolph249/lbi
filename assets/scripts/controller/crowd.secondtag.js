lbiApp.controller('createMarket.secondtagCtrl', [
    '$scope',
    '$state',
    'lbiService',
    function($scope, $state, lbiService) {
		

		$scope.inArray=$.inArray;

		$scope.isShowSecondTag = true;

        $scope.$on('$stateChangeSuccess', function(e, tostate, toparams) {
            $scope.tagid = toparams.tagid;
            $scope.tagtype = toparams.tagtype;

            $scope.checkedLabels=toparams.tags?toparams.tags.split(','):[];


            lbiService('getSecondSelectTag', {
                tagid: $scope.tagid
            }, 'POST').then(function(tags) {
                // debugger;
                $scope.tags=tags;
            });
        });

        $scope.selectlabel=function(tagid,tagvalue,tagtype){

        	//默认多选

        	if (tagtype == 'checkbox') {
                var index = -1;
                index = $.inArray(tagvalue, $scope.checkedLabels);

                index === -1 ? $scope.checkedLabels.push(tagvalue) : $scope.checkedLabels.splice(index, 1);

            } else if (tagtype == 'radio') {
                $scope.checkedLabels = [tagvalue];
            }

        };

        $scope.redirectTostep1=function(){
        	$state.go('index.crowd.step1',{
        		secondtagid:$scope.tagid,
        		secondtags:$scope.checkedLabels.join(',')
        	});
        }
    }
]);
