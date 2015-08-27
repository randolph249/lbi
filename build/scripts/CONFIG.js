var DEFAULT_CITY="杭州",HOT_CITYLIST=["北京","上海","广州","深圳","杭州","成都","天津"],CITY_LIST=[{province:"直辖",list:[{citycode:"010",cityname:"北京",poiname:"西单大悦城",lat:39.910904,lng:116.372894,pinyin:"BEIJING"},{citycode:"021",cityname:"上海",poiname:"久光百货",lat:31.224046,lng:121.446053,pinyin:"SHANGHAI"},{citycode:"022",cityname:"天津",poiname:"恒隆广场",lat:39.12823,lng:117.200343,pinyin:"TIANJIN"},{cityname:"重庆",lng:"107.8787519",lat:"30.0543031",citycode:"0811",pinyin:"CHONGQING"}]},{province:"广东",list:[{citycode:"020",cityname:"广州",poiname:"万象城",lat:23.098376,lng:113.234946,pinyin:"GUANGZHOU",province:"广东"},{citycode:"0755",cityname:"深圳",poiname:"深圳华润万象城",lat:22.539696,lng:114.110883,pinyin:"SHENZHEN",province:"广东"},{citycode:"020",cityname:"增城",lat:23.290496999999995,lng:113.82957899999997,pinyin:"ZENGCHENG"}]},{province:"浙江",list:[{citycode:"0571",cityname:"杭州",poiname:"杭州大厦",lat:30.272559,lng:120.161466,pinyin:"HANGZHOU",province:"浙江"},{cityname:"宁波",lng:"121.4848428",lat:"29.72270863",citycode:"0574",pinyin:"NINGBO",province:"浙江"},{cityname:"温州",lng:"120.4676048",lat:"27.89283406",citycode:"0577",pinyin:"WENZHOU",province:"浙江"},{cityname:"衢州",lng:"118.6796544",lat:"28.931459",citycode:"0570",pinyin:"QUZHOU",province:"浙江"},{cityname:"舟山",lng:"122.193581",lat:"30.11907883",citycode:"0580",pinyin:"ZHOUSHAN",province:"浙江"},{citycode:"0572",cityname:"德清",lat:30.534927,lng:119.96766200000002,pinyin:"DEQING",province:"浙江"},{citycode:"0574",cityname:"余姚",lat:30.04540400000001,lng:121.15629399999995,pinyin:"YUYAO"},{cityc:"0576",cityname:"温岭",pinyin:"WENLING",lat:28.368781000000006,lng:121.37361099999998}]},{province:"四川",list:[{citycode:"028",cityname:"成都",poiname:"龙湖北城天街",lat:30.710713,lng:104.067457,pinyin:"CHENGDU",province:"四川"},{cityname:"绵阳",lng:"104.7059134",lat:"31.84677874",citycode:"0816",pinyin:"MIANYANG",province:"四川"}]},{province:"河北",list:[{cityname:"石家庄",lng:"114.4457684",lat:"38.1311835",pinyin:"SHIJIAZHUANG",province:"河北"},{cityname:"邯郸",lng:"114.5487528",lat:"36.55251098",citycode:"0310",pinyin:"HANDAN",province:"河北"}]},{province:"山西",list:[{cityname:"太原",lng:"112.3219584",lat:"37.95977759",citycode:"0351",pinyin:"TAIYUAN",province:"山西"}]},{province:"内蒙古",list:[{cityname:"呼和浩特",lng:"111.5044915",lat:"40.59267317",pinyin:"HUHEHAOTE",province:"内蒙古"}]},{province:"辽宁",list:[{cityname:"沈阳",lng:"123.1432634",lat:"42.09650697",citycode:"024",pinyin:"SHENYANG",province:"辽宁"},{cityname:"大连",lng:"122.1969347",lat:"39.58695372",citycode:"0411",pinyin:"DALIAN",province:"辽宁"}]},{province:"吉林",list:[{cityname:"长春",lng:"125.7737031",lat:"44.38596897",citycode:"0431",pinyin:"CHANGCHUN",province:"吉林"},{cityname:"吉林",lng:"126.8493303",lat:"43.58191441",citycode:"0432",pinyin:"JILIN",province:"吉林"}]},{province:"黑龙江",list:[{cityname:"哈尔滨",lng:"127.9644882",lat:"45.63942855",pinyin:"HAERBIN",province:"黑龙江"}]},{province:"江苏",list:[{cityname:"南京",lng:"118.8479973",lat:"31.92543252",citycode:"025",pinyin:"NANJING",province:"江苏"},{cityname:"无锡",lng:"120.080292",lat:"31.52212792",citycode:"0510",pinyin:"WUXI",province:"江苏"},{cityname:"徐州",lng:"117.519459",lat:"34.35673481",citycode:"0516",pinyin:"XUZHOU",province:"江苏"},{cityname:"常州",lng:"119.6413932",lat:"31.62281325",citycode:"0519",pinyin:"CHANGZHOU",province:"江苏"},{cityname:"苏州",lng:"120.6603878",lat:"31.38131609",citycode:"0512",pinyin:"SUZHOU",province:"江苏"},{cityname:"盐城",lng:"120.1898193",lat:"33.51922951",citycode:"0515",pinyin:"YANCHENG",province:"江苏"}]},{province:"安徽",list:[{cityname:"合肥",lng:"117.3602657",lat:"31.76038583",citycode:"0551",pinyin:"HEFEI",province:"安徽"}]},{province:"福建",list:[{cityname:"龙岩",lng:"116.7437726",lat:"25.29020185",citycode:"0597",pinyin:"LONGYAN",province:"福建"}]},{province:"江西",list:[{cityname:"宜春",lng:"114.9778595",lat:"28.30304766",citycode:"0795",pinyin:"YICHUN",province:"江西"},{cityname:"新余",citycode:"0790",pinyin:"XINYU",lat:27.81083399999999,lng:114.930835}]},{province:"山东",list:[{cityname:"济南",lng:"117.0970709",lat:"36.73894591",citycode:"0531",pinyin:"JINAN",province:"山东"},{cityname:"青岛",lng:"120.1510697",lat:"36.44775112",citycode:"0532",pinyin:"QINGDAO",province:"山东"},{cityname:"淄博",lng:"118.0590954",lat:"36.60825502",citycode:"0533",pinyin:"ZIBO",province:"山东"},{cityname:"烟台",lng:"120.80764",lat:"37.24597168",citycode:"0535",pinyin:"YANTAI",province:"山东"},{cityname:"潍坊",lng:"119.0773303",lat:"36.54874005",pinyin:"WEIFANG",province:"山东"},{cityname:"济宁",lng:"116.7396398",lat:"35.37425253",citycode:"0537",pinyin:"JINING",province:"山东"},{cityname:"威海",lng:"122.0005257",lat:"37.11827468",pinyin:"WEIHAI",province:"山东"},{cityname:"莱州",pinyin:"LAIZHOU",citycode:349,lat:"37.18272499999999",lng:"119.94213500000001"}]},{province:"河南",list:[{cityname:"郑州",lng:"113.478682",lat:"34.62441249",citycode:"0371",pinyin:"ZHENGZHOU",province:"河南"},{cityname:"洛阳",lng:"112.0371308",lat:"34.2906723",citycode:"0379",pinyin:"LUOYANG",province:"河南"},{cityname:"平顶山",lng:"113.0170797",lat:"33.79457262",pinyin:"PINGDINGSHAN",province:"河南"},{cityname:"新蔡",pinyin:"XINCAI",citycode:"0396",lng:"114.97524600000003",lat:"32.749947999999996"},{cityname:"新密",citycode:"0371",pinyin:"XINMI",lat:34.537845999999995,lng:113.38061600000003}]},{province:"湖北",list:[{cityname:"武汉",lng:"114.3484304",lat:"30.62186774",citycode:"027",pinyin:"WUHAN",province:"湖北"},{citycode:"0717",cityname:"宜都",lat:30.387233999999996,lng:111.45436700000005,pinyin:"YIDU"}]},{province:"湖南",list:[{cityname:"长沙",lng:"113.1584712",lat:"28.22379538",citycode:"0731",pinyin:"CHANGSHA",province:"湖南"},{cityname:"郴州",lng:"113.1416036",lat:"25.81133469",citycode:"0735",pinyin:"CHENZHOU",province:"湖南"}]},{province:"广西",list:[{cityname:"南宁",lng:"108.4678356",lat:"23.05442694",citycode:"0771",pinyin:"NANNING",province:"广西"}]},{province:"贵州",list:[{cityname:"贵阳",lng:"106.7108901",lat:"26.83917854",citycode:"0851",pinyin:"GUIYANG",province:"贵州"}]},{province:"云南",list:[{cityname:"昆明",lng:"102.8745045",lat:"25.38369632",citycode:"0871",pinyin:"KUNMING",province:"云南"},{citycode:"0875",cityname:"保山",lat:25.11180199999999,lng:99.16713299999992,pinyin:"BAOSHAN"},{citycode:"0873",cityname:"蒙自",lat:23.366842999999996,lng:103.38500499999998,pinyin:"MENGZI"}]},{province:"陕西",list:[{cityname:"西安",lng:"108.7965812",lat:"34.10574191",citycode:"029",pinyin:"XIAN",province:"陕西"}]},{province:"甘肃",list:[{cityname:"兰州",lng:"103.639981",lat:"36.35516794",citycode:"0931",pinyin:"LANZHOU",province:"甘肃"}]},{province:"青海",list:[{cityname:"西宁",lng:"101.4386471",lat:"36.82593799",citycode:"0971",pinyin:"XINING",province:"青海"}]},{province:"新疆",list:[{cityname:"乌鲁木齐",lat:43.792818,lng:87.61773299999993,citycode:"0991",pinyin:"URUMQI"}]}];