//crowd.htlm 
// 实时时段选择directive
lbiApp.directive('realtimecheck', [function(){
    // Runs during compile
    return {
        templateUrl:'realtimecheck.html',
        scope:{
            updateRealtime:'&',
        },
        compile:function(elm,attrs){
            return {
                pre:function($scope,iElm,iAttrs){
                    $scope.checkedHours=[];

                    $scope.hours=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                    //判断当前时段是否选中
                    $scope.isChecked=function(hour){
                        return $.inArray(hour, $scope.checkedHours)!=-1;
                    };

                    //选中或者取消当前时段
                    $scope.toggleHour=function(hour){
                        var $index=$.inArray(hour,$scope.checkedHours);
                        if($index==-1){
                            $scope.checkedHours.push(hour);
                        }else{
                            $scope.checkedHours.splice($index,1);

                        }


                        //trigger updateRealtime function 
                        $scope.updateRealtime && $scope.updateRealtime({
                            hours:$scope.checkedHours
                        });
                    }

                }
            }
        }
    };
}]);