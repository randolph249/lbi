lbiApp.controller('addrCtrl', [
	'$scope',
	'$state',
	'$timeout',
	function($scope, $state, $timeout) {
		var params, bound = {},
			legend, polygons;

		$scope.$on('$stateChangeSuccess', function(e, tostate, toparams, fstate, fparams) {

			var targetstate = tostate.name;
			var fromstate = fstate.name;
			if (targetstate == 'index.address') {
				$state.go('index.address.step1');
				return false;
			}

			if (targetstate == 'index.address.step2') {

				if (fromstate !== 'index.address.step1') {
					$state.go('index.address.step1');
					return false;
				} else {
					$timeout(function() {
						$scope.$broadcast('BROADCAST_TILE_PARAMS', params);
						$scope.$broadcast('BROADCAST_BOUND_PARAMS', bound, legend)
					}, 500);
				}

			}
		});

		$scope.$on('EMIT_TILE_PARAMS', function(e, p) {
			params = p;
		});

		$scope.$on('EMIT_BOUND_PARAMS', function(e, b, l) {
			bound = b;
			legend = l;
		});

	}
])
