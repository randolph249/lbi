lbiApp.filter('converttokm',
    function() {
        return function(val) {
            return (val / 1000).toFixed(1);
        };
    });

//数字格式转换 10000=>10,000
lbiApp.filter('numberformat',
    function() {
        return function(val) {
            if (isNaN(Number(val))) {
                return 0;
            }
            val = '' + val;

            var arr = [],
                rem = val.length % 3,
                //余值
                mult = Math.floor(val.length / 3);
            if (val.length < 4) {
                return val;
            }

            rem && arr.push(val.substr(0, rem));
            for (var i = 0,
                    len = mult; i < len; i++) {
                arr.push(val.substr(rem + i * 3, 3));
            }
            return arr.join(',');
        };
    });
//自动补全 例：1=>001
lbiApp.filter('tripledigit',
    function() {
        return function(val) {
            val = '' + val;
            if (val.length < 2) {
                return '00' + val;
            }
            if (val.length < 3) {
                return '0' + val;
            }
            return val;
        };
    });

lbiApp.filter('doubledigit',
    function() {
        return function(val) {
            return val > 9 ? val : ('0' + val);
        };
    });

//判断是否是空对象
lbiApp.filter('isEmpty',
    function() {
        return function(val) {
            return $.isEmptyObject(val);
        };
    });

//删除某些字段
lbiApp.filter('deltext',
    function() {
        return function(val, text) {
            return val.replace(text, '');
        };
    });

//将城市编码转换成城市名
lbiApp.filter('codetocityname', function() {
    return function(val) {
        var cityname = '';
        $.each(CITY_LIST, function(index, item) {
            if (item.citycode == val) {
                cityname = item.cityname;
                return false;
            }
        });
        return cityname;
    }

});

lbiApp.filter('fuzzycount', function() {
	return function(val){
		val=Number(val);
		if(isNaN(val) || val<=150){
			return '少量';
		}else{
			return '约'+val+'人';
		}
	}
});
