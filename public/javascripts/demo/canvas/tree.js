
window.onload = function() {
   var canvas = document.getElementById('tree')
    var ctx = canvas.getContext('2d')
    canvas.width = 640;
    canvas.height = 640; ;
    drawTree(ctx, 320, 470, 60, -Math.PI / 2, 12, 12);
}
var drawTree = function(ctx, startX, startY, length, angle, depth, branchWidth){
	var rand = Math.random,  
	newLength, newAngle, newDepth, maxBranch = 3,  
	endX, endY, maxAngle = 2 * Math.PI / 4,  
	subBraches;  
	ctx.beginPath();  
	ctx.moveTo(startX, startY);  
	endX = startX + length * Math.cos(angle);  
	endY = startY + length * Math.sin(angle);  
	ctx.lineCap = 'round';  
	ctx.lineWidth = branchWidth;  
	ctx.lineTo(endX, endY);  
	if (depth <= 2){  
		ctx.strokeStyle = 'rgb(0,' + (((rand() * 64) + 128) >> 0) + ',0)';  
	} else {  
		ctx.strokeStyle = 'rgb(' + (((rand() * 64) + 64) >> 0) + ',50,25)';  
	}  
	ctx.stroke();  
	newDepth = depth - 1;  
	if (!newDepth)  
	return;  
	subBranches = (rand() * (maxBranch - 1)) + 1;  
	branchWidth *= 0.7;  
	for (var i = 0; i < subBranches; i++){  
		newAngle = angle + rand() * maxAngle - maxAngle * 0.5;  
		newLength = length * (0.7 + rand() * 0.3);  
		drawTree(ctx, endX, endY, newLength, newAngle, newDepth, branchWidth);  
	}
} 

function Tree(x,y,branchLen,branchWidth,depth,ctx){
	this.ctx = ctx;
	this.x = x||0;  
    this.y = y||0;  
    this.branchLen = branchLen||0;  
    this.branchWidth = branchWidth||0;  
    var depth = depth || 5;  
    this.branchLenFactor = 0.8;  
    this.rootLenFactor = 1.2;  
    this.branchAngle = 20;   
    this.oBranchAngle = this.branchAngle;  
    this.branchAngleFactor = 5;  
    this.swingAngle = 0;
	this.drawRoot() 
}
Tree.prototype.drawRoot = function(){
   var x = this.x,y=this.y,branchLen = this.branchLen,depth = this.depth,branchWidth = this.branchWidth;  
    var toX = x;  
    var toY = y-branchLen*this.rootLenFactor;  
    var depth = depth||5;  
    this.ctx.save();  
    this.ctx.strokeStyle="rgba(37, 141, 194, 0.93)";  
    this.ctx.beginPath();  
    this.ctx.lineCap = "butt";  
    this.ctx.lineJoin="round";  
    this.ctx.lineWidth = this.branchWidth;  
    this.ctx.moveTo(x,y);  
    this.ctx.lineTo(toX,toY);  
    this.ctx.closePath();  
    this.ctx.stroke();  
    this.ctx.restore();  
    depth--;  
    if(depth>0){  
      this.drawBranch(toX,toY,branchLen*this.branchLenFactor,branchWidth-1,this.branchAngle,depth);  
      this.drawBranch(toX,toY,branchLen*this.branchLenFactor,branchWidth-1,-this.branchAngle,depth);  
}
}
Tree.prototype.drawBranch =function(x,y,branchLen,branchWidth,angle,depth){
	var angle = angle || 0;  
    var radian = (90-angle)*(Math.PI/180);  
    var toX = x+Math.cos(radian)*branchLen;  
    var toY = y-Math.sin(radian)*branchLen;  
    this.ctx.save();  
    this.ctx.strokeStyle="rgba(37, 141, 194, 0.93)";  
    this.ctx.beginPath();  
    this.ctx.lineCap = "butt";  
    this.ctx.lineJoin="round";  
    this.ctx.lineWidth = branchWidth;  
    this.ctx.moveTo(x,y);  
    this.ctx.lineTo(toX,toY);  
    this.ctx.closePath();  
    this.ctx.stroke();  
    this.ctx.restore();  
    depth--;  
    if(depth>0){  
      this.drawBranch(toX,toY,branchLen*this.branchLenFactor,branchWidth-1,angle+this.branchAngle,depth);  
      this.drawBranch(toX,toY,branchLen*this.branchLenFactor,branchWidth-1,angle-this.branchAngle,depth);  
    }  
}
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();