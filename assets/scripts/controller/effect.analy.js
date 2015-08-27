//营销效果分析
lbiApp.controller('effect.analyCtrl', [
  '$scope',
  'SweetAlert',
  '$state',
  'lbiService',
  function($scope, SweetAlert, $state, lbiService) {

    var queryEffect = function(params) {
      return lbiService('getEffectAnalysis', params);
    };

    //处理total 数据 补充coupons_buy_percent、coupons_written_percent、to_store_percent属性
    var handelTotalData = function(totalStat) {
      totalStat['coupons_buy_percent'] = (100 * totalStat[
        'coupons_buy_num'] / totalStat['coupons_click_count']).toFixed(
        2) + '%';
      totalStat['coupons_written_percent'] = (100 * totalStat[
        'coupons_written_num'] / totalStat['coupons_buy_num']).toFixed(
        2) + '%';
      totalStat['to_store_percent'] = (100 * totalStat['to_store_num'] /
        totalStat['toshop_click_num']).toFixed(2) + '%';

      $scope.totalStat = totalStat;
    };
    //将关于detail处理成chart line 可以处理的格式
    // {
    // 	xAxis:{
    // 		categories:[x1,x2]
    // 	},
    // 	series:[{
    // 		name:'',
    // 		data:[val1,val2]
    // 	}]
    // }
    var handlerDetailData = function(details) {
      var keys = $.map($scope.clickItems.concat($scope.effectItems),
          function(item) {
            return item.type;
          }),
        detailStat = {};


      //玄幻detailObj数组
      $.each(details, function(index, item) {
        $.each(keys, function(keyindex, key) {


          if (key == 'coupons_buy_percent') {
            val = Number((100 * item['coupons_buy_num'] / item[
              'coupons_click_count']).toFixed(2));
          } else if (key == 'coupons_written_percent') {
            val = Number((100 * item['coupons_written_num'] /
              item['coupons_buy_num']).toFixed(2));

          } else if (key == 'to_store_percent') {
            val = Number((100 * item['to_store_num'] / item[
              'toshop_click_num']).toFixed(2));

          } else {
            val = item[key]
          }


          //判断detailStat[jItem]是否已经创建
          if (detailStat[key]) {
            detailStat[key]['xAxis']['categories'].push('' + item
              .createtime);
            detailStat[key]['series']['0']['data'].push(val);
          } else {
            detailStat[key] = {
              xAxis: {
                categories: ['' + item.createtime]
              },
              series: [{
                name: $.grep($scope.clickItems.concat(
                  $scope.effectItems), function(item) {
                  return item.type == key;
                })[0]['name'],
                data: [val]
              }]
            }
          }
        });
      });

      debugger;

      $scope.detailStat = detailStat;
    };

    //判断chart valueSuffix是否是%
    $scope.isSuffixPercent = function(itemname) {
      return $.inArray(itemname, ['coupons_buy_percent',
        'coupons_written_percent', 'to_store_percent'
      ]) != -1;
    }


    //监听路由changesuccess事件
    $scope.$on('$stateChangeSuccess', function(e, tostate, toparams) {

      //如果没有活动ID
      if (!toparams['id']) {
        return false;
      }


      $scope.startDate = toparams.startdate;
      $scope.endDate = toparams.enddate;


      //必须有开始日期参数和截止日期参数
      if (toparams['startdate'] && toparams['enddate']) {
        //请求关键效果和点击效果
        lbiService('getEffectAnalysis', {
          endDate: toparams['enddate'],
          startDate: toparams['startdate'],
          activityid: toparams['id']
        }).then(function(info) {


          handelTotalData(info[0]['totals'][0]);
          handlerDetailData(info[0]['details']);

        });
      }
    });

    //监听开始时间
    $scope.$watch('startDate', function(startDate) {
      if (!startDate) {
        return false;
      }

      $state.go('index.effect.analy', {
        startdate: startDate
      });
    });

    //监听结束时间
    $scope.$watch('endDate', function(endDate) {
      if (!endDate) {
        return false;
      }
      $state.go('index.effect.analy', {
        enddate: endDate
      });
    });

    //点击效果统计项
    $scope.clickItems = [{
      type: 'page_click_count',
      name: '页面'
    }, {
      name: '优惠券',
      type: 'coupons_click_count'
    }, {
      name: '进入店铺',
      type: 'toshop_click_count'
    }, {
      name: '电话咨询',
      type: 'call_click_count'
    }];
    $scope.clickSingeType = 'page_click_count';
    //关键效果统计项
    $scope.effectItems = [{
      type: 'coupons_buy_num',
      name: '优惠券购买人数'
    }, {
      name: '优惠券销售数量',
      type: 'coupons_sale_num'
    }, {
      name: '优惠券核销数量',
      type: 'coupons_written_num'
    }, {
      name: '到店人数',
      type: 'to_store_num'
    }, {
      name: '购买率',
      type: 'coupons_buy_percent'
    }, {
      name: '成交率',
      type: 'coupons_written_percent'
    }, {
      name: '到店率',
      type: 'to_store_percent'
    }];
    //默认图表展示优惠券购买人数
    $scope.effectSingeType = 'coupons_buy_num';
  }
]);
