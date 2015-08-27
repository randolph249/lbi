lbiApp.directive('membertags', ['getTrades', '$state', function(getTrades, $state) {


    /**
     * [switchToArrstr 原始数据{id:[value1:value2]},转化数据[{id:id,value:[value1,value2]}]]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    function switchToArrstr(obj) {
            var arr = [];
            $.each(obj, function(index, item) {
                arr.push({
                    id: index,
                    value: item
                });
            });
            return JSON.stringify(arr);
        }
        // Runs during compile
    return {
        scope: {
            tags: '=',
            checkedCall: '&'
        },
        templateUrl: 'membertags.html',
        compile: function(tElm, tAttrs) {
            return {
                pre: function($scope, iElm, iAttrs) {


                    $scope.checkedMylabels = {};
                    $scope.inArray = $.inArray;

                    $scope.showSwitchTag = iAttrs.showSwitchTag == 'false' ? false : true;
                    //选择标签
                    $scope.selectlabel = function(tagid, value, type) {

                        //默认多选
                        var tagtype = tagtype || 'checkbox';

                        var arr = $scope.checkedMylabels[tagid] || [];


                        if (tagtype == 'checkbox') {
                            var index = -1;
                            index = $.inArray(value, arr);

                            index === -1 ? arr.push(value) : arr.splice(index, 1);

                        } else if (tagtype == 'radio') {
                            arr = [value];
                        }


                        $scope.checkedMylabels[tagid] = arr;
                        //emit to parent contorller
                        $scope.checkedCall && $scope.checkedCall({
                            labels: $scope.checkedMylabels
                        });
                        return false;
                    };

                }
            }
        }
    };
}]);
