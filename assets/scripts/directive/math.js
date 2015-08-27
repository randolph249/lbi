/**
封装的canvas的能描画的类
*/
function PixBound(x1,y1,x2,y2) {
	this.left = x1;
	this.top = y1;
	this.getWidth = function() {
		return Math.abs(x2-x1);
	}
	this.getHeight = function() {
		return Math.abs(y2-y1);
	}
}

/**
描画瓦片的类
*/
function TMap() {
	this.mercator_r = 20037508.34;
	this.MinLatitude = -85.05112878;
    this.MaxLatitude = 85.05112878;
    this.MinLongitude = -180;
    this.MaxLongitude = 180;
}

TMap.prototype = {

	/**
	获取最小值
	*/
	Clip:function(n, minValue, maxValue){
    	return Math.min(Math.max(n, minValue), maxValue);
	},
	/**	
	像素转经纬度
	*/
	PixelToLngLat:function(pixel, z){
	  	var pixelX=pixel.x;
	  	var pixelY=pixel.y;
    	var mapSize = this.MapSize(z);
    	var x = (this.Clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
    	var y = 0.5 - (this.Clip(pixelY, 0, mapSize - 1) / mapSize);
    	var latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    	var longitude = 360 * x;
    	return new AMap.LngLat(longitude,latitude);
	},
	/**	
	经纬度转像素
	*/
	LngLatToPixel:function(pt, z){
		var latitude=pt.lat;
		var longitude=pt.lng;
		var MinLatitude = this.MinLatitude;
     	var MaxLatitude = this.MaxLatitude;
    	var MinLongitude = this.MinLongitude;
    	var MaxLongitude = this.MaxLongitude;
        latitude = this.Clip(latitude, MinLatitude, MaxLatitude);
        longitude = this.Clip(longitude, MinLongitude, MaxLongitude);

        var x = (longitude + 180) / 360; 
        var sinLatitude = Math.sin(latitude * Math.PI / 180);
        var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
        var pixelX;
        var pixelY;
        
        var mapSize = this.MapSize(z);
        pixelX = this.Clip(x * mapSize + 0.5, 0, mapSize - 1);
        pixelY = this.Clip(y * mapSize + 0.5, 0, mapSize - 1);
  		return new AMap.Pixel(pixelX,pixelY);
    },
    /**
	地图窗口大小
	*/
	MapSize:function(z){
	    return 256*Math.pow(2,z);
	},
	/**	
	经纬度转墨卡托坐标
	*/
	lonLat2Mercator:function(lnglat) {
		var x = lnglat.lng * this.mercator_r / 180,
	    	M_PI = Math.PI;
	    var y = Math.log(Math.tan((90 + lnglat.lat) * M_PI / 360)) / (M_PI / 180);
	    	y = y * this.mercator_r / 180;
	    var mercator = {X:x,Y:y};
	    return mercator;
	},
	/**	
	墨卡托转经纬度坐标
	*/
	mercator2LonLat:function(mercator){
		var x = mercator.X / this.mercator_r * 180,
	    	y = mercator.Y / this.mercator_r * 180,
	    	M_PI = Math.PI,
	    	y = 180 / M_PI * (2 * Math.atan(Math.exp(y * M_PI / 180)) - M_PI / 2),
	    	lnglat = new AMap.LngLat(x, y);
	    return lnglat;
	},

	/**	
	获取瓦片的bounds
	*/
	getTileBounds:function(x,y,z) {
		var pixelX= x * 256,
		    pixelY= y * 256,
		    px = new AMap.Pixel(pixelX,pixelY),
		    minPX=new AMap.Pixel(px.x,px.y+255),
		    maxPX=new AMap.Pixel(px.x+255,px.y),
		    sw = this.PixelToLngLat(minPX, z),
		    ne = this.PixelToLngLat(maxPX, z);
			return new AMap.Bounds(sw,ne);
	},
	/**	
	获取两个经纬度的距离
	*/
	getDistance:function(a,b){
		var c=a.lat*Math.PI/180,
			d=b.lat*Math.PI/180,
			dis=(Math.asin(Math.sqrt(Math.pow(Math.sin((c-d)/2),2)+
				Math.cos(c)*Math.cos(d)*Math.pow(Math.sin((a.lng-b.lng)*Math.PI/180/2),2)))*12756274);
			return dis;
	},
	/**	
	判断两个bounds是否相交
	*/
	intersectsBounds:function(first,second) {
		var intersects = false,
			self = {left:first.getSouthWest().lng,right:first.getNorthEast().lng,
				top:first.getNorthEast().lat,bottom:first.getSouthWest().lat},
			bounds = {left:second.getSouthWest().lng,right:second.getNorthEast().lng,
				top:second.getNorthEast().lat,bottom:second.getSouthWest().lat};
	    var mightTouch = (
	        self.left == bounds.right ||
	        self.right == bounds.left ||
	        self.top == bounds.bottom ||
	        self.bottom == bounds.top
	    );
	    if (!mightTouch) {
		  	var inBottom = (
	            ((bounds.bottom >= self.bottom) && (bounds.bottom <= self.top)) ||
	            ((self.bottom >= bounds.bottom) && (self.bottom <= bounds.top))
	        );
	        var inTop = (
	            ((bounds.top >= self.bottom) && (bounds.top <= self.top)) ||
	            ((self.top > bounds.bottom) && (self.top < bounds.top))
	        );
	        var inLeft = (
	            ((bounds.left >= self.left) && (bounds.left <= self.right)) ||
	            ((self.left >= bounds.left) && (self.left <= bounds.right))
	        );
	        var inRight = (
	            ((bounds.right >= self.left) && (bounds.right <= self.right)) ||
	            ((self.right >= bounds.left) && (self.right <= bounds.right))
	        );
	        intersects = ((inBottom || inTop) && (inLeft || inRight));
	    }else {
	    	return true;
	    }
	    return intersects;
	},
	/**	
	获取gid的bounds
	*/
	getGidsByBound:function(box,size) {
		var sw=new AMap.LngLat(box.getSouthWest().lng,box.getSouthWest().lat);
		var ne=new AMap.LngLat(box.getNorthEast().lng,box.getNorthEast().lat);
		//经纬度转墨卡托坐标
		var point1=this.lonLat2Mercator(sw);
		var x1=parseInt(Math.floor((point1.X-size)/size));
		var y1=parseInt(Math.floor((point1.Y-size)/size));
		var point2=this.lonLat2Mercator(ne);
		var x2= parseInt(Math.ceil(point2.X/size));
		var y2= parseInt(Math.ceil(point2.Y/size));		
		var gidList =new Array();

		for(var i=x1;i<=x2;i++){
			for(var j=y1;j<=y2;j++){
				var p1= {X:(i)*size,Y:(j)*size},
					p2= {X:(i+1)*size,Y:(j+1)*size},
					pt1=this.mercator2LonLat(p1),
					pt2=this.mercator2LonLat(p2),
					minx=pt1.lng,
					miny=pt1.lat,
					maxx=pt2.lng,
					maxy=pt2.lat,
					small = new AMap.LngLat(minx,miny),
					big = new AMap.LngLat(maxx,maxy),
					temp =new AMap.Bounds(small,big);
				if(this.intersectsBounds(box,temp)){
					gidList.push(i+"_"+j);
				}
			}
		}
		return gidList;
	},

	/**
	计算瓦片的gid
	*/
	calulateGids:function(x,y,z) {
		var bounds = this.getTileBounds(x,y,z),
			gidobj = this.getGidSize(bounds),
			size = gidobj.gidsize,
			name = gidobj.gidname;
		var array = this.getGidsByTile(bounds,size);
		return {gidname:name,gids:array};
	},
	/**
	获取gid的bounds
	*/
	getBoundByGid:function(gid, size) {
		var gids = gid.split("_");
		var x = parseFloat(gids[0]);
		var y = parseFloat(gids[1]);
		
		var mx1 = x * size;
		var my1 = y * size;
		
		var mx2 = mx1 + size;
		var my2 = my1 + size;
		var point1 = {X:mx1, Y:my1};
		var point2 = {X:mx2, Y:my2};
		var lnglat1 = this.mercator2LonLat(point1);
		var lnglat2 = this.mercator2LonLat(point2);
		var bound = new AMap.Bounds(lnglat1, lnglat2);
		return bound;
	},
	/**
	获取gid的墨卡托bounds
	*/
	getMerBoundByGid:function(gid, size) {
		var gids = gid.split("_");
		var x = parseFloat(gids[0]);
		var y = parseFloat(gids[1]);
		
		var mx1 = x * size;
		var my1 = y * size;
		
		var mx2 = mx1 + size;
		var my2 = my1 + size;
		var point1 = {X:mx1, Y:my1};
		var point2 = {X:mx2, Y:my2};
		
		return {sw:point1,ne:point2};
	},
	/**
	获取瓦片的像素Bounds
	*/
	getTilePixBounds:function(x,y,z) {
			var pixelX= x * 256,
		    pixelY= y * 256,
		    px = new AMap.Pixel(pixelX,pixelY),
		    minPX=new AMap.Pixel(px.x,px.y+255),
		    maxPX=new AMap.Pixel(px.x+255,px.y);
		    return {sw:minPX, ne:maxPX};
	},
	/**
	获取gid的像素Bounds
	*/
	getGidPixBound:function(gid, size, z) {
		var gids = gid.split("_");
		var x = parseFloat(gids[0]);
		var y = parseFloat(gids[1]);
		
		var mx1 = x * size;
		var my1 = y * size;
		var mx2 = mx1 + size;
		var my2 = my1 + size;
		var point1 = {X:mx1, Y:my1};		

		var point2 = {X:mx2, Y:my2};
		var lnglat1 = this.mercator2LonLat(point1);
		var lnglat2 = this.mercator2LonLat(point2);
		var pixel1 = this.LngLatToPixel(lnglat1, z);
		var pixel2 = this.LngLatToPixel(lnglat2, z);
		return {sw:pixel1, ne:pixel2};
	},

	/**
	获取瓦片的墨卡托bounds
	*/
	getTileMerBounds:function(x,y,z) {
		var resoultion=this.ZoomToResolution(z);
		var r = 20037508.342789244;
		var minX=x*256*resoultion - r;
		var minY=(Math.pow(2,z)-1-y)*256*resoultion - r;
		var maxX=(x+1)*256*resoultion - r;
		var maxY=(Math.pow(2,z)-y)*256*resoultion - r;
		var sw = {X:minX, Y:minY},
			ne = {X:maxX, Y:maxY};
		return {sw:sw,ne:ne};
	},

	/**
	获取gid的canvas的描画bounds
	*/
	getRectCanvasRegion:function(pixTileBound, gid, size, z) {
		var tile_left_top = {X:pixTileBound.sw.x, Y:pixTileBound.ne.y};
		var tile_right_down = {X:pixTileBound.ne.x, Y:pixTileBound.sw.y};

		var gidBound = this.getGidPixBound(gid, size, z);

		var gid_left_top = {X:gidBound.sw.x, Y:gidBound.ne.y};
		var gid_right_down = {X:gidBound.ne.x, Y:gidBound.sw.y};
		return new PixBound(gid_left_top.X-tile_left_top.X,
			gid_left_top.Y-tile_left_top.Y,
			gid_right_down.X-tile_left_top.X,
			gid_right_down.Y-tile_left_top.Y);

	},
	/**
	矫正bounds使其满足sw坐标最小，ne最大
	*/
	correctBounds:function(bounds) {
		var s = bounds.getSouthWest();
		var n = bounds.getNorthEast();
		var slng = s.lng;
		var slat = s.lat;
		var blng = n.lng;
		var blat = n.lat;
		if (slng > blng) {
		    slng = n.lng;
		    blng = s.lng;
		}
		if (slat > blat) {
		   slat = n.lat;
		   blat = s.lat;
		}
		var s1 = new AMap.LngLat(slng,slat);
		var n1 = new AMap.LngLat(blng, blat);
		var newb = new AMap.Bounds(s1, n1);
		return newb;
	},
	/**
	获取不同的层级的解析度
	*/
	ZoomToResolution:function(levelOfDetail){
		var resolution=0;
		switch(levelOfDetail){
			case 1:{
				resolution=78271.5170;
				break;
			}
			case 2:{
				resolution=39135.7585;
				break;
			}
			case 3:{
				resolution=19567.8792;
				break;
			}
			case 4:{
				resolution=9783.9396;
				break;
			}
			case 5:{
				resolution=4891.9698;
				break;
			}
			case 6:{
				resolution=2445.9849;
				break;
			}
			case 7:{
				resolution=1222.9925;
				break;
			}
			case 8:{
				resolution=611.4962;
				break;
			}
			case 9:{
				resolution=305.7481;
				break;
			}
			case 10:{
				resolution=152.8741;
				break;
			}
			case 11:{
				resolution=76.4370;
				break;
			}
			case 12:{
				resolution=38.2185;
				break;
			}
			case 13:{
				resolution=19.1093;
				break;
			}
			case 14:{
				resolution=9.5546;
				break;
			}
			case 15:{
				resolution=4.7773;
				break;
			}
			case 16:{
				resolution=2.3887;
				break;
			}
			case 17:{
				resolution=1.1943;
				break;
			}
		}
		return resolution;
    }

};

