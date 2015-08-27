lbiApp.controller('addr.step2Ctrl', [
	'$scope',
	'$state',
	'lbiService',
	'queryNearPoiByBatch',
	'getGridTileLegend',
	'tileLegend',
	'tagEnitySwitch',
	'SweetAlert',
	'formatwkt',
	'safeApply',
	function(
		$scope,
		$state,
		lbiService,
		queryNearPoiByBatch,
		getGridTileLegend,
		tileLegend,
		tagEnitySwitch,
		SweetAlert,
		formatwkt,
		safeApply
	) {
		var reqparams = {},
			adcode, districtcode;
		$scope.$on('$stateChangeSuccess', function(e, tostate, toparams) {
			$scope.cityname = toparams.city;
			$scope.districtname = toparams.district;
		});

		$scope.$on('BROADCAST_TILE_PARAMS', function(e, p, bound, legend, polygons) {
			reqparams = p;
			adcode = p.adcode;
			$scope.gridSize=p.size;

			districtcode = p.districtcode;
			//查询门店信息
			queryStoreInfo()

		});

		$scope.$on('BROADCAST_BOUND_PARAMS', function(e, bound, legend, polygons) {
			$scope.bound = bound; //设置边界
			$scope.legend = legend;
			//获取图例
			getLegends();
		});

		//获取图例
		var getLegends = function() {
			lbiService('getLegends', reqparams, 'POST').then(function(info) {
				$scope.originLegends = info;
				$scope.tileLegends = tileLegend(info);
			});
		};


		//接受当前选中图例
		$scope.selectLegends = function(legends) {

			if (legends.length) {
				getGids(legends);
			} else {
				$scope.tileParams = {};
			}
		};

		var getGids = function(range) {
			var finalParams = $.extend({
				section: range.join(';')
			}, reqparams);


			//先获取GID列表

			lbiService('getGids', finalParams, 'POST').then(function(res) {

				// 瓦片参数
				$scope.tileParams = {
					gids: res[0].gids,
					bound: $scope.bound,
					legend: $scope.legend
				}
			})
		};



		//可供选择的POI类型
		$scope.poilist = {
			'060200': '便利店',
			'060400': '超市',
			'060101': '购物中心',
			'150500': '地铁站',
			'150200': '火车站',
			'150100': '机场',
			'150702': '公交站'
		};

		//默认选中的POI列表
		$scope.poiCheckedList = ['060200', '150500'];

		//选中或者取消某个POI
		$scope.togglePoi = function(poicode) {
			var index = $.inArray(poicode, $scope.poiCheckedList);
			if (index == -1) {
				$scope.poiCheckedList.length < 3 && $scope.poiCheckedList.push(poicode);
				getNearPois(); //更新门店周边POI列表
				updateTargetPois(poicode);

			} else {
				$scope.poiCheckedList.length > 1 && $scope.poiCheckedList.splice(index,
					1);
				// deleteRelateNearPois();
			}
		};

		//所有的门店列表一次性全部返回 然后前端按照pagesize=5进行分页
		var originStorelist = [];

		//获取当前用户上传文件信息
		//先获取文件ID 然后根据文件ID 拿到上传店铺列表

		var queryStoreInfo = function() {
			lbiService('getFiles', {}, 'POST').then(function(info) {
				$scope.filename = info[0].title;
				$scope.fileid = info[0].id;
				//return getStores();
			}).then(function() {
				return lbiService('getPhysicalStoreList', {
					adcode: adcode,
					distcode: districtcode,
					ismatch: 1,
					fileid: $scope.fileid
				}, 'POST')
			}).then(function(info) {
				originStorelist = info;
				$scope.storepage = 1;
				$scope.storetotal = Math.ceil(info.length / 3);
			});
		}


		//默认展示门店
		$scope.storestatus = "show";
		//显示或者当前的门店（最多5个）
		$scope.toggleStores = function() {
			if (!originStorelist.length) {
				return false;
			}

			if ($scope.storestatus == 'show') {
				$scope.storeiconlist = [];
				$scope.storestatus = 'hide';
			} else {
				$scope.storestatus = 'show';
				$scope.storeiconlist = [].concat($scope.storelist);
			}

		};

		//获取门店附近一公里内的POI店铺
		var getNearPois = function() {
			queryNearPoiByBatch({
				//门店坐标列表
				locs: $.map($scope.storelist, function(item) {
					return item.x + ',' + item.y;
				}),
				//poi类型列表
				keys: $.map($scope.poiCheckedList, function(item) {
					return {
						key: $scope.poilist[item],
						type: item
					}
				})
			}).then(function(results) {
				$scope.storeNearPoiList = results;
			});
		};



		//默认最多显示5个门店 执行分页
		$scope.storepaging = function(page) {

			$scope.storelist = originStorelist.slice((page - 1) * 5, page * 5);
			//门店列表table和地图展示门店列表使用不同的数据源
			//保证隐藏门店的时候 只隐藏地图上的ICON 不隐藏table
			if ($scope.storestatus == 'show') {
				$scope.storeiconlist = [].concat($scope.storelist);
			}
			//获取门店附近1公里范围内的poi店铺
			getNearPois();
		};

		var storeNearPois;
		$scope.getNearPoiCount = function(poilist, store, poitype) {
			$scope.storeNearPoiByslice = []; //清空之前的附近ICON图
			$scope.storeNearPageIndex = 1; //默认展示前50条数据

			storeNearPois = poilist.pois;
			$scope.storeNearCircle = {
				center: [poilist.center.getLng(), poilist.center.getLat()],
				radius: 1000,
				options: {
					strokeColor: "#fff", //线颜色
					strokeWeight: 4,
					strokeOpacity: 1, //线透明度
					fillColor: "#ffffff", //填充颜色
				}
			};

			//设置一个偏离ICON
			if (storeNearPois.length > 50) {

			} else {
				showNearPoi();
			}

			var storeNearTipLnglat = poilist.center.offset(1000, 0);
			$scope.storeNearTipLnglat = [{
				x: storeNearTipLnglat.getLng(),
				y: storeNearTipLnglat.getLat()
			}];
		};

		var showNearPoi = function() {
			var storeNearPoiByslice = storeNearPois.slice(($scope.storeNearPageIndex - 1) * 50, $scope.storeNearPageIndex * 50);
			if (Math.ceil(storeNearPois.length / 50) == $scope.storeNearPageIndex) {
				$scope.storeNearPageIndex = 1;
			} else {
				$scope.storeNearPageIndex = $scope.storeNearPageIndex + 1;
			}
			$scope.storeNearPoiByslice = $.map(storeNearPoiByslice, function(item) {
				item.x = item.location.getLng();
				item.y = item.location.getLat();
				return item;
			});
		}

		$scope.showNearPoileast50 = function(e) {
			showNearPoi();
		};

		//添加商圈
		$scope.targetPoilist = [];
		$scope.printparams = [];
		$scope.addTargetCircle = function(e) {
			if ($scope.targetPoilist.length > 10) {
				return false;
			}
			var targetPoiInfo = {
				lng: e.lnglat.getLng(),
				lat: e.lnglat.getLat(),
				x: e.lnglat.getLng(),
				y: e.lnglat.getLat(),
				name: '目标区域' + ($scope.targetPoilist.length + 1),
				status: 'read',
				radius: 1000
			};
			queryNearPoiByBatch({
				locs: [e.lnglat.getLng() + ',' + e.lnglat.getLat()],
				keys: $.map($scope.poiCheckedList, function(item) {
					return {
						key: $scope.poilist[item],
						type: item
					}
				})
			}).then(function(results) {
				targetPoiInfo.relatepois = results[targetPoiInfo.x + ',' + targetPoiInfo.y];
				$scope.targetPoilist.push(targetPoiInfo);
			});
		};

		//监听目标区域参数
		//修改生成pdf链接
		$scope.$watch('targetPoilist', function(targetPoilist) {
			var params = [];

			params = $.map(targetPoilist, function(item) {
				var newItem = {};
				newItem.name = item.name;
				newItem.coord = item.x + ',' + item.y;
				newItem.radius = 1000;
				return newItem;
			});

			$scope.printparams = $.param({
				fileid: $scope.fileid,
				jsonarray: JSON.stringify(params)
			});

		}, true);


		//当选中POI 有新增以后更新POI 信息
		var updateTargetPois = function(poicode) {
			//遍历 只添加新增的POI类型数量
			if ($scope.targetPoilist.length == 0) {
				return false;
			}
			queryNearPoiByBatch({
				locs: $.map($scope.targetPoilist, function(item) {
					return item.x + ',' + item.y;
				}),
				keys: [{
					key: $scope.poilist[poicode],
					type: poicode
				}]
			}).then(function(results) {
				$.map($scope.targetPoilist, function(item) {
					return item.x + ',' + item.y;
				});
				$.each($scope.targetPoilist, function(index, item) {

					if (results[item.x + ',' + item.y]) {
						item.relatepois[poicode] = results[item.x + ',' + item.y][poicode]
					}
				});

			});
		};



		$scope.back = function() {
			$state.go('index.address.step1');
		}

	}
]);
