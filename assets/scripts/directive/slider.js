//封装jQuery plugin slider
lbiApp.directive('slidebar', ['safeApply', function(safeApply) {
    // Runs during compile
    var post = function($scope, ele, attr, ngModel) {
        var options = $scope.options || {};
        ele.slider(options);

        ele.on('slide', function(e, ui) {
            updateSlide(ui.value);
        });
        ele.on('slidestop', function(e, ui) {
            safeApply($scope, function() {
                $scope.updateSlider && $scope.updateSlider({
                    value: ui.value
                });
            });
        });

        //更新slider value
        var updateSlide = function(value) {
            safeApply($scope, function() {
                ngModel.$setViewValue(value);
            });
        };
    }
    return {
        restrict: 'AC',
        scope: {
            options: '=',
            updateSlider: '&'
        },
        require: 'ngModel',
        compile: function() {
            return {
                post: post
            }
        }


    };
}]);
