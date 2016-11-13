// 粒子
function PraticleView(options, canvas){
    if (this === window) {
        return new PraticleView(options, canvas);
    }
    this.img = options.image;//背景图片
    this.options = options;
    this.options.crop = [0, 0, this.img.naturalWidth, this.img.naturalHeight]
    this.praticles = [];
    this.canvas = canvas || this.prepareCanvas();
    this.ctx = canvas.getContext('2d')
    this.animateHeader = true;
    this.addListeners();
    //设置windows.requestAnimFrame动画方法
    this.setRequestAnimFrame();
    this.drawParticle();
    this.animate();

}
PraticleView.prototype.prepareCanvas = function() {
    var canvas = document.createElement('canvas');
    return canvas;
}
PraticleView.prototype.prepareBackground = function() {
    var background = document.createElement('canvas');
    background.width = this.canvas.width;
    background.height = this.canvas.height;

    var context = background.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.img, this.options.crop[0], this.options.crop[1],
     this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height
    )
    //this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height)
}
PraticleView.prototype.prepareGlass = function() {
    this.glass = document.createElement('canvas');
    this.glass.width = this.canvas.width;
    this.glass.height = this.canvas.height;
    this.context = this.glass.getContext('2d');
    this.context.fillStyle = 'rgb(255,255,0)';
    this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fill();
    this.ctx.drawImage(this.glass, 0, 0, this.canvas.width, this.canvas.height)
};
PraticleView.prototype.drawParticle = function() {
    for(var x = 0; x < this.canvas.width*0.5; x++) {
        var c = new Praticle(this.canvas.width, this.canvas.height, this.ctx);
        this.praticles.push(c);
    }
    
}
PraticleView.prototype.animate = function() {
    if(this.animateHeader) {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        for(var i in this.praticles) {
            this.praticles[i].draw();
        }
    }
    window.requestAnimFrame(this.animate.bind(this))
}
PraticleView.prototype.setRequestAnimFrame = function() {
    var fps = this.options.fps;
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / fps);
            };
    })();
};
PraticleView.prototype.addListeners = function() {
    window.addEventListener('scroll', this.scrollCheck);
    window.addEventListener('resize', this.resize);
}

PraticleView.prototype.scrollCheck = function() {
    if(document.body.scrollTop > height) this.animateHeader = false;
    else this.animateHeader = true;
}

PraticleView.prototype.resize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
}

function Praticle(width, height, ctx) {
    this.pos = {};
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.init(width, height);
}
Praticle.prototype.init = function() {
    this.pos.x = Math.random() * this.width;
    this.pos.y = this.height + Math.random() * 100;
    this.alpha = 0.1 + Math.random() * 0.3;
    this.scale = 0.1 + Math.random() * 0.3;
    this.velocity = Math.random();
}
Praticle.prototype.draw = function() {
    if(this.alpha <= 0) {

        this.init()
    }
    this.pos.y -= this.velocity;
    this.alpha -= 0.0005;
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.scale*10, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'rgba(255,255,255,'+ this.alpha+')';
    this.ctx.fill();
}
window.onload = function(){
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var img = new Image()
    img.src = 'bg.jpg'
    img.onload = function() {
        var options = {
            image: this
        }
        var particleView = PraticleView(options, canvas)              
    }; 
    
}