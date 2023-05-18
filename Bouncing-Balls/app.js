const canvas = document.querySelector("#canvas");
const c = canvas.getContext('2d');
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
canvas.width = windowWidth;
canvas.height = windowHeight;

function randomColor() {
    return (
        "rgb(" + 
        Math.floor(Math.random()*250) + "," +
        Math.floor(Math.random()*250) + "," + 
        Math.floor(Math.random()*250) + ")"
    )
}

class Ball{
    constructor(){
        this.color = randomColor();
        this.radius = Math.random() * 20 + 10;
        this.sx = Math.random() * (windowWidth - this.radius*2) + this.radius;
        this.sy = Math.random() * (windowHeight - this.radius  * 2);
        this.dy = Math.random() * 2;
        this.dx = Math.round(Math.random() * 2 - 3) * 4;
        this.vel = Math.random() / 5;
        this.drawBalls = function(){
            c.beginPath();
            c.arc(this.sx,this.sy,this.radius,0,2*Math.PI);
            c.fillStyle = this.color;
            c.fill();
        }
    }
}

let balls = [];
for(let i=0;i<30;i++){
    balls.push(new Ball());
}

function animateBalls(){
    if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        canvas.width = windowWidth;
        canvas.height = windowHeight;
    }
    c.clearRect(0,0,windowWidth,windowHeight);
    requestAnimationFrame(animateBalls);
    for(let i=0;i<balls.length;i++){
        balls[i].drawBalls();
        balls[i].sy += balls[i].dy;
        balls[i].sx += balls[i].dx;
        if(balls[i].sy + balls[i].radius >= windowHeight){
            balls[i].dy = -balls[i].dy;
        }
        else{
            balls[i].dy += balls[i].vel
        }
        if (balls[i].sx + balls[i].radius > windowWidth || balls[i].sx - balls[i].radius < 0) {
            balls[i].dx = -balls[i].dx;
        }
    }
}

animateBalls();