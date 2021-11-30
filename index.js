const canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let particleArray = [];
const adjustX = 5;
const  adjustY = 10;
const spacing = 11;
const lineMaxLength = 50;

//mouse interactions
const mouse = {
    x:null,
    y:null,
    radius:50
};

window.addEventListener("mousemove",(event)=>{
    mouse.x = event.x;
    mouse.y = event.y;
});

//text
ctx.fillStyle="white";
ctx.font = "30px Verdana";
ctx.fillText("A",0,30);
const textCoordination = ctx.getImageData(0,0,100,100);
//particles
class Particle{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random()*30 + 1;
        this.returnSpeed = 10;
        this.radius = 10;
    }
    draw(){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceX = dx/distance;
        let forceY = dy/distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance)/maxDistance;
        let directionX = forceX*force*this.density;
        let directionY = forceY*force*this.density;
        if(distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        }else{
            if(this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/this.returnSpeed;
            }
            if(this.y !== this.baseY){}
            let dy = this.y - this.baseY;
            this.y -= dy/this.returnSpeed;
        }
    }
}
function init(){
    for(let y = 0,y2 = textCoordination.height;y<y2;y++){
        for(let x = 0,x2 = textCoordination.width;x<x2;x++){
            if(textCoordination.data[(y*4*textCoordination.width)+(x*4)+3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                //console.log(positionX * spacing ,positionY * spacing);
                particleArray.push(new Particle(positionX * spacing,positionY * spacing));
            }
        }
    }
}
init();
// particles connections
function connect(){
    let opacityValue = 1;
    for(let a = 0;a<particleArray.length;a++){
        for(let b = a;b<particleArray.length;b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < lineMaxLength){
                opacityValue = 1 - (distance/lineMaxLength);
                ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x,particleArray[a].y);
                ctx.lineTo(particleArray[b].x,particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//animation
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0;i < particleArray.length;i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
    //console.log(particleArray.length);
}
animate();


