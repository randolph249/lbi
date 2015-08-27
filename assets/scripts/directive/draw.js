function Canvas2D (width,height){

	this.width = width;
	this.height = height;
	this.ele = _createCanvas();
	this.canvas = this.ele.getContext("2d");
	this.clearRect(); 

	function _createCanvas() {
		var canva = document.getElementById("tile_gid_canvas_ele");
		if (!canva) {
			canva = document.createElement("canvas");
			canva.id = "tile_gid_canvas_ele";
			canva.width = width;
			canva.height = height;
			canva.style.display = "none";
			document.body.appendChild(canva);
			
		}
		return canva;
	}

}
Canvas2D.prototype = {
	createImage:function() {
		var content = this.ele.toDataURL("image/png");
		return content;
	},
	addRect:function(boundpix,color) {
		var inwidth = boundpix.getWidth();
		var inheight = boundpix.getHeight();
		this.canvas.beginPath();

		this.canvas.fillStyle=color;
		this.canvas.fillRect(boundpix.left ,boundpix.top,inwidth,inheight);
		
		//this.canvas.strokeStyle="#FFFFFF";  //边框颜色
		//this.canvas.linewidth=1;
		//this.canvas.strokeRect(boundpix.left ,boundpix.top,inwidth,inheight);
		this.canvas.closePath();
	},
	clearRect:function() {
		var w = this.width;
		var h = this.height;
		this.canvas.clearRect(0, 0, w, h);  
	},
	deleteCanvas:function() {
		if (this.ele) {
			this.ele.parentNode.removeChild(this.ele);
		}
		this.ele = null;
	}

};

function Legend() {
	this.colors = ["#EEEA27", "#B1CE24", "#48A935", "#176A58", "#1D386F", "#522661", "#D72229"];
}
Legend.prototype.getColor= function(count) {

	if (count < 150) {
		return this.colors[0];
	} else if(count < 300) {
		return this.colors[1];
	}else if(count < 450) {
		return this.colors[2];
	}else if(count < 600) {
		return this.colors[3];
	}else if(count < 750) {
		return this.colors[4];
	}else if(count < 1000) {
		return this.colors[5];
	}else {
		return this.colors[6];
	}

};

/**
array:数据的数组,如：[150,200,278]
**/
Legend.prototype.getAutoColor= function(array, count) {
	var cl = this.colors.length;
	for (var i=0;i<array.length;i++) {
		var index = i % cl;
		if (count <= array[i]) {
			return this.colors[index];
		}
	}
};

/**
描画瓦片的类
x:瓦片的x坐标
y:瓦片的y坐标
z:瓦片的所处的层级
gids:gid的数据，类型Array，例如：[21586_8116_130,21586_8116_130...]
bounds:gid所覆盖的区域，类型AMap.Bounds
size:gid的大小
legenddata:legend数组
**/
function html5Draw(x,y,z,gids,bounds,size,legenddata) {
  	var tmap = new TMap();
  	var legend = new Legend();
  	var small = tmap.getTileBounds(x,y,z);
  	var big = tmap.correctBounds(bounds);
  	var noneurl = "http://www.maptiler.org/img/none.png?x="+x+"&y="+y+"&z="+z;
  	if (!tmap.intersectsBounds(big,small)){
    	return noneurl;
  	}

    var c = new Canvas2D(256,256);
    var pixTileBound = tmap.getTilePixBounds(x, y, z);
    var flag = false;
    
    for (var i=0;i<gids.length;i++) {
      var gid = gids[i];
      var gidbounds = tmap.getBoundByGid(gid, size);
      if (tmap.intersectsBounds(small,gidbounds) && tmap.intersectsBounds(big,gidbounds)) {
        flag = true;
        var gidarray = gid.split("_");
        var coor = gidarray[0]+"_"+gidarray[1];
        var gidcount = parseInt(gidarray[2]);
        var b = tmap.getRectCanvasRegion(pixTileBound, gid, size, z);
        c.addRect(b,legend.getAutoColor(legenddata,gidcount));
      }
    }
    if (flag) {
      var url = c.createImage();
      return url;
    }else {
      return noneurl;
    }

}