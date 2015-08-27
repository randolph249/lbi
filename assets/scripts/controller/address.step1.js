lbiApp.controller('addr.step1Ctrl', [
	'$scope',
	'$state',
	'lbiService',
	'fetureLabels',
	'onlineShoplist',
	'offlineListResource',
	'getGridTileLegend',
	'tileLegend',
	'queryCityListByCrowdParams',
	'tagEnitySwitch',
	'SweetAlert',
	'$timeout',
	'formatwkt',
	'safeApply',
	function(
		$scope,
		$state,
		lbiService,
		fetureLabels,
		onlineShoplist,
		offlineListResource,
		getGridTileLegend,
		tileLegend,
		queryCityListByCrowdParams,
		tagEnitySwitch,
		SweetAlert,
		$timeout,
		formatwkt,
		safeApply
	) {


		$scope.districtData = [];
		var taobaoTag, featurelables, checkedlabels, t;
		cityTag = '112117',
			districtTag = '112706',
			reqParams = {
				datatype: 'C5'
			};

		//当前地图级别是否是城市级别 来定义
		var isMaplevelEqualDistrict = function(params) {
			//如果当前城市adcode!==当前curadcpde
			//表示当前地图级别是级别
			if ($scope.curcode && ($scope.citycode !== $scope.curcode)) {
				delete params[cityTag];
				params[districtTag] = [$scope.curcode];
			} else {
				delete params[districtTag];
				params[cityTag] = [$scope.citycode];
			}
			return params
		};
		//获取当前区域内的人口数
		var getCityCount = function() {

			reqParams = $.extend(reqParams, {
				flag: $scope.crowdSourceChecked.replace('A',''),
				tagEntitys: {},
				adcode: $scope.citycode,
				usershopid: $scope.onlineTaobaoCheckedId,
				fileId: $scope.offlineMemberCheckedId,
				datatype: 'C5'
			});

			if (reqParams.flag == '1') {
				reqParams.tagEntitys[taobaoTag] = [$scope.onlineTaobaoCheckedId];
			}
			//删除区域code
			delete reqParams.tagEntitys[districtTag];
			reqParams.tagEntitys[cityTag] = [$scope.citycode];

			var finalParams = $.extend({}, reqParams);
			finalParams = $.extend(true, finalParams, {
				tagEntitys: checkedlabels,
				adcode: $scope.citycode
			});
			finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);

			lbiService('getDistribeCount', finalParams, 'POST').then(function(info) {
				$scope.districtLegend = tileLegend(info[0].legends, 'rank');

				var districtData = info[0].cityDistribeInfo;
				$scope.districtLegend = tileLegend(info[0].legends, 'rank');
				$.each(districtData, function(index, item) {
					var wkt = [];
					// 默认只使用一个区域
					$.each(item.wkt, function(wndex, wtem) {
						wkt = wkt.concat(formatwkt(wtem));
					});
					item.wkt = wkt;
				});
				$scope.districtData = districtData;
			}).then(function() {
				//if地图级别是城市 筛选结果
				if ($scope.curcode == $scope.citycode) {
					return getFilterCount();
				}
			}).then(function() {
				$timeout(function() {
					//如果上次选中的区县code在当前的区县列表里面 
					//就选用上次的区县code 
					//else 默认当前区县列表中的第一个为选中的区县数据
					var curcode;
					$.each($scope.districtData, function(index, item) {
						if (item['county'] === $scope.curcode) {
							curcode = item['county'];
						}
					});
					!curcode && (curcode = $scope.districtData[0]['county']);

					$scope.curcode = curcode;
				}, 100)

			});

		};
		//获取筛选结果
		var getFilterCount = function() {

			reqParams.tagEntitys = isMaplevelEqualDistrict(reqParams.tagEntitys)
			var finalParams = $.extend({}, reqParams);
			finalParams = $.extend(true, finalParams, {
				tagEntitys: checkedlabels
			});
			finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);

			//请求筛选结果
			lbiService('getCount', finalParams, 'POST').then(function(info) {
				$scope.reqError = false;
				$scope.crowdCount = info[0].crowdCount;
			}, function() {
				$scope.reqError = true;
				$scope.crowdCount = false;
			});
		};
		//根据会员文件获取当前城市列表
		var requestCurcitylist = function(params) {
			params.tagEntitys = {};
			if (params.flag == '1') {
				params.tagEntitys[taobaoTag] = [params.usershopid];
			}
			params.tagEntitys = tagEnitySwitch(params.tagEntitys);


			// queryCityListByCrowdParams(params).then(function(citylist){},function(desc,errorcode){

			// });

			lbiService('getCitylistByFilter', params, 'POST').then(function(info) {
				$scope.citylist = info;
			}, function() {
				$scope.reqError = true;
				$scope.citylist = [{}];
				SweetAlert.swal({
					title: '当前文件匹配人数过少!',
					text: '请选择其他线下会员文件或者使用线下淘宝店会员',
					confirmButtonColor: '#399eee',
					confirmButtonText: '确定'
				});
			}).then(function() {
				//延时请求当前城市数据的筛选数据
				//because 城市列表可能没有变化 所以无法触发checkCity函数
				t = $timeout(function() {
					getCityCount();
				}, 500);
			});
		};
		//获取网格图图例
		var getLegends = function() {
			reqParams.tagEntitys = isMaplevelEqualDistrict(reqParams.tagEntitys);
			var finalParams = $.extend(true, {
				size: 600
			}, reqParams);

			finalParams = $.extend(true, finalParams, {
				tagEntitys: checkedlabels
			});

			//判断当前地图级别是否是区县级别
			//如果是区县 从tagEntitys中删除城市adcode 添加区县adcode
			finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);


			getGridTileLegend(finalParams).then(function(info){
				$scope.showTileThumb=true;
				$scope.originLegends=info.legends;
				$scope.tileLegends=tileLegend(info.legends);
				$scope.gridSize=info.size;

			});
			return false;

			lbiService('getLegends', finalParams, 'POST').then(function(info) {
				$scope.showTileThumb = true;
				$scope.originLegends = info;
				$scope.tileLegends = tileLegend(info);
			});
		};

		//获取GID信息
		var getGids = function(range) {
			var finalParams = $.extend(true, {
				size: $scope.gridSize,
				section: range.join(';')
			}, reqParams);

			finalParams = $.extend(true, finalParams, {
				tagEntitys: checkedlabels
			});

			//判断当前地图级别是否是区县级别
			//如果是区县 从tagEntitys中删除城市adcode 添加区县adcode
			finalParams.tagEntitys = isMaplevelEqualDistrict(finalParams.tagEntitys);
			finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);
			//先获取GID列表

			lbiService('getGids', finalParams, 'POST').then(function(res) {
				// 瓦片参数
				$scope.tileParams = {
					gids: res[0].gids,
					bound: $scope.districtBound,
					legend: $scope.originLegends
				}
			})
		};

		$scope.crowdSourceList = [{
			type: 'A0',
			name: '线下会员文件'
		}, {
			type: 'A1',
			name: '线上淘宝会员'
		}, {
			type: 'A2',
			name: '全淘宝会员'
		}];

		//现获取标签TAG
		//获取线上会员文件列表
		fetureLabels.then(function(tags) {
			taobaoTag = tags[0]['member'][0]['tagid'];
			$scope.filterLabels = tags[0]['base'];
		}).then(function() {
			return onlineShoplist;
		}).then(function(list) {
			$scope.onlineTaobaoList = list;
			$scope.onlineTaobaoCheckedId = list[0].dataId;
			//默认选中线上文件
			$scope.crowdSourceChecked = 'A1';
		});

		//
		//获取线下会员文件列表
		offlineListResource.query().then(function(info) {
			$scope.offlineMemberList = info;
			$scope.offlineMemberCheckedId = info[0].id;
		});

		$scope.$watch('crowdSourceChecked+onlineTaobaoCheckedId', function() {
			// 如果受众是线上淘宝店会员

			if ($scope.crowdSourceChecked == 'A1' && $scope.onlineTaobaoCheckedId) {
				//发送数据请求
				requestCurcitylist({
					flag: '1',
					usershopid: $scope.onlineTaobaoCheckedId
				});
			}

			if ($scope.crowdSourceChecked == 'A2') {
				requestCurcitylist({
					flag: '2'
				});
			}
		});

		$scope.$watch('crowdSourceChecked+offlineMemberCheckedId', function() {
			// 如果受众人群是线下会员
			if ($scope.crowdSourceChecked == 'A0' && $scope.offlineMemberCheckedId) {
				//发送数据请求
				requestCurcitylist({
					flag: '0',
					fileId: $scope.offlineMemberCheckedId
				});
			}
		});

		//接受城市信息
		$scope.checkcity = function(poi) {
			//请求
			t && $timeout.cancel(t);
			$scope.citycode = poi.citycode;
			$scope.cityname = poi.cityname;

			$scope.curcode = poi.citycode;
			//获取当前城市区县信息

			getCityCount();

			$scope.showTileThumb = false;
		};

		//接受当前选中的tag
		$scope.checkedFilterLabels = function(labels) {
			checkedlabels = labels;
			getCityCount();
		};


		//展示所有区县集合
		$scope.showAllCountys = function() {

			$scope.showTileThumb = false;
			$scope.tileParams = {};

			$scope.curcountyname = '';
			$scope.curcode = $scope.citycode;
			getFilterCount();
		};


		//展示某个选中区县
		$scope.showItemCounty = function(bound, info) {
			$scope.curcountyname = info.name;

			if (!Number(info.count)) {
				$scope.showTileThumb = false;
				return false;
			}

			if (!isNaN(info.count) && Number(info.count) > 150) {
				//获取动态区间/获取GID
				$scope.districtBound = bound;
				getLegends();
				//获取当前区域筛选人数
				getFilterCount();
			} else {
				safeApply($scope, function() {
					$scope.tileParams = {};
					$scope.crowdCount = 0;
					$scope.reqError = true;
				})
			}
		};

		// $scope.$watch('curcode', function(curcode) {
		// 	var $index;
		// 	$.each($scope.districtData, function(index, item) {
		// 		if (item.county == curcode) {
		// 			$index = index;
		// 		}
		// 	});

		// 	!isNaN($index) && ($scope.distIndex = $index);
		// });

		//接受当前选中图例
		$scope.selectLegends = function(legends) {

			if (legends.length) {
				getGids(legends);
			} else {
				$scope.tileParams = {};
			}
		};

		$scope.secondStep = function() {

			if ($scope.curcode == $scope.citycode || !$scope.crowdCount) {
				SweetAlert.swal({
					title: '请选择区县',
					text: '请在地图上点击想要进行分析的区县',
					confirmButtonColor: '#399eee',
					confirmButtonText: '确定'
				});
				return false;
			}

			if (!$scope.crowdCount) {
				SweetAlert.swal({
					title: '人数过少'
				});
				return false;
			}

			var finalParams = $.extend(true, {
				cityname: $scope.cityname,
				districtname: $scope.curcountyname,
				size: $scope.gridSize,
				districtcode: $scope.curcode
			}, reqParams);

			finalParams = $.extend(true, finalParams, {
				tagEntitys: checkedlabels
			});




			//判断当前地图级别是否是区县级别
			//如果是区县 从tagEntitys中删除城市adcode 添加区县adcode
			finalParams.tagEntitys = tagEnitySwitch(finalParams.tagEntitys);


			$scope.$emit('EMIT_TILE_PARAMS', finalParams);
			$scope.$emit('EMIT_BOUND_PARAMS', $scope.districtBound, $scope.originLegends);

			$state.go('index.address.step2',{
				city:$scope.cityname,
				district:$scope.curcountyname
			});

		};
	}
]);
