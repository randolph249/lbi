//绘制图表
lbiApp.directive('brixChart', [function() {
  // Runs during compile
  var BRIXCHARTS = false;
  var lazyLoadBrix = function(callback) {

    if ($.type(AChart) == "function") {
      callback();
      return false;
    }

    setTimeout(function() {
      lazyLoadBrix(callback);
    }, 100);
    return false;
  }

  return {
    scope: {
      datasource: "@",
      type: "@"
    },
    link: function($scope, iElm, iAttrs, controller) {

      $scope.datasource = {};

      var elmId = iAttrs.id,
        type = iAttrs.type,
        xlabel = iAttrs.xlabel || "", //x坐标维度名
        wid = $(iElm).width(),
        hei = $(iElm).height(),
        charts;

      $scope.$watch("datasource", function() {
        var datasource = $scope.datasource;
        if ($.type(datasource) == "string" && datasource != "") {
          datasource = JSON.parse(datasource);
        } else {
          return false;
        }
        //在brix chart 加载完成以后执行 绘图
        lazyLoadBrix(function() {
          drawCharts(type, datasource);
        });

      });

      function drawCharts(type, series) {
        //清空容器
        chart = undefined;
        iElm.empty();
        switch (type) {
          case "pie":
            drawPie(series);
            break;
          case "bar":
            drawBar(series);
            break;
          case "bar2":
            drawBar2(series);
            break;
          case "line":
            drawLine(series);
            break;
          case "map":
            drawMap(series);
            break;
          case "":
            draw
          default:
            break;

        }
      }


      //绘制饼图
      function drawPie(series) {
        //{"name1":200,"name2":100}转化成[{name:name1,y:200},{name:name2,y:100}]
        var total = 0;

        //总数据数
        $.each(series, function(index, item) {
          total = +Number(item);
        });

        var switchtoSeries = function(data) {
            var switchdata = [];
            $.each(data, function(index, item) {
              switchdata.push({
                name: index,
                y: Number(item)
              });
            });
            return switchdata;
          },
          seriesdata = switchtoSeries(series),
          chart = new AChart({
            theme: AChart.Theme.Base,
            id: elmId,
            width: wid,
            height: hei,
            //宽度
            plotCfg: {
              margin: [10, 120, 10, 10]
            },
            tooltip: {
              pointRenderer: function(point) {
                return (point.percent * 100).toFixed(2) + '%';
              }
            },
            //series公用属性设置
            seriesOptions: {
              pieCfg: {
                colors: ["#F74D7D", "#6280A1", "#5BCB8A", "#B0704A",
                  "#937ACC", "#6280A1", "#45B5E6", "#5BCB8A"
                ],
                allowPointSelect: true,
                labels: {
                  distance: -20, //文本距离圆的距离
                  label: {
                    fill: '#e5e5e5'
                      //文本信息可以在此配置
                  },
                  renderer: function(value, item) { //格式化文本
                    return (item.point.percent * 100).toFixed(1) +
                      '%';
                  }
                },
                innerSize: '30%', //内部的圆，留作空白
              }
            },
            series: [{
              type: 'pie',
              name: xlabel,
              data: seriesdata,
              legendType: 'circle',
              legend: {
                dy: 10, //跟绘图区域的偏移y
                dx: 200,
                layout: 'vertical',
                align: "top",
                strokeWidth: 0,
                back: { //背景的配置信息，等同于shape的attrs
                  stroke: null //stroke : null 清除边框
                }
              }
            }]
          });
        chart.render();
        return false;
      };

      //绘制柱状图
      function drawBar(series) {

        var xAxisLable = [],
          seriesdata = [],
          total = 0; //显示百分比


        if (Object.keys) {
          xAxisLable = Object.keys(series)
        }

        //累加得到total
        $.each(series, function(index, item) {
          //Object.keys方法不存在
          if (!Object.keys) {
            xAxisLable.push(index);
          }
          total += Number(item);
        });

        //数值转换为百分比
        $.each(series, function(index, item) {
          seriesdata.push(Number(
            (100 * item / total).toFixed(2)
          ));
        });


        //实例化柱状图
        var chart = new AChart({
          colors: ['#937ACC'],
          theme: AChart.Theme.Base,
          id: elmId,
          width: wid,
          height: hei,
          legend: null,
          plotCfg: {
            margin: [10, 10, 50, 30]
          },
          xAxis: {
            categories: xAxisLable,
            labels: {
              label: {
                rotate: -45,
                'text-anchor': 'end'
              }
            },
          },
          yAxis: {
            min: 0,
            labels: {
              renderer: function(value) {
                return value + "%";
              }
            }
          },
          tooltip: {
            valueSuffix: '%'
          },
          series: [{
            name: xlabel,
            type: 'column',
            autoWidth: true,
            data: seriesdata,
            labels: { //显示的文本信息
              label: {
                rotate: -90,
                y: 10,
                'fill': '#fff',
                'text-anchor': 'end',
                "text-shadow": '0 0 3px black',
                'font-size': '12px'
              },
              renderer: function(value, item) {
                return value + "%";
              }
            }

          }]
        });
        chart.render();
        return false;
      };


      //线形图
      function drawLine(series) {
        var values = [],
          names = [];

        var valueSuffix = iAttrs.valuesuffix || '';


        var chart = new AChart($.extend(true, series, {
          colors: ['#937ACC'],
          theme: AChart.Theme.Base,
          id: elmId,
          width: wid,
          height: hei,
          legend: null,
          plotCfg: {
            margin: [10, 10, 50, 30]
          },
          xAxis: {
            labels: {
              label: {
                rotate: wid / series.xAxis.categories.length > 40 ?
                  0 : -45,
                'text-anchor': 'end'
              }
            },
          },
          yAxis: {
            min: 0,
            labels: {
              renderer: function(value) {
                return value + valueSuffix;
              }
            }
          },
          tooltip: {
            valueSuffix: valueSuffix,
            crosshairs: true
          }
        }));

        chart.render();
        return false;
      }

      //绘制地图
      function drawMap(series) {
        return false;
        var values = [],
          names = [],
          sets = [];
        $.each(series, function(index, item) {
          //如果有中国其他这个字段
          index = index.replace(/\u5e02/, '').replace("中国", "");
          var set = "<set value='" + item + "'><name name='" +
            index + "'/></set>";
          sets.push(set);

        });
        charts = new BRIXCHARTS({
          parent_id: elmId,
          config: {
            configData: '<?xml version="1.0"?><chart v="1.0" type="map"><data><info contents="name" bolds="1,0,0" colors="#7459B3" sizes="10" f_c="#7459B3"/><colors normals="#C9BCE5" over="#FFFFFF"/><sign value="10"/><list value="10"/></data></chart>',
            chartData: '<?xml version="1.0"?><chart><data><sets>' +
              sets.join('') + '</sets></data></chart>'
          }
        });
      }

    }
  };
}]);
