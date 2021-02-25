/* ------ JavaScript - HTML Canvas Particles - Bubble Text Animation Part 2 ------ */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d'); // ctx is short for context.
ctx.canvas.width = window.innerWidth; // setting window width.
ctx.canvas.height = window.innerHeight; // setting window height.
let particleArray = [];
let adjustX = 27; // this will move the particle text across the screen in X.
let adjustY = 17; // this will move the particle text up and down the screen in Y.
ctx.lineWidth = 3; // this gives a stronger line to the bubbles shape.


// handle mouse interactions
const mouse = {
    x: null,
    y: null,
    radius: 150 // this adjusts the size of the mouse's influence effecting the particles.
}
// event listener
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});
ctx.fillStyle = 'white';
ctx.font = '30px sans-serif';
ctx.fillText('Bubbles!', 0, 30); // The A, is where the text input is written in, 0 = x and 40 = y coordinates.
const textCoordinates = ctx.getImageData(0, 0, 115, 115); // this affects the screen crop field.

// This is the blueprint to create particles.
class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 8) + 1; // These density values control the speed of movement.
        this.distance;
    }
    // ---- this draw method affects the look of the particles ----
    draw(){
        ctx.fillStyle = 'rgba(255,255,255,0.8'; // this is for the bubble highlight.
        ctx.strokeStyle = 'rgba(34,147,214,1)'; // this light blue colour is for the bubble edge outlines.
        ctx.beginPath();

        if (this.distance < mouse.radius - 5){
            this.size = 13;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 3, this.y - 3, this.size/2.5, 0, Math.PI * 2); // reflection / highlight
            ctx.arc(this.x + 7, this.y - 1, this.size/3.5, 0, Math.PI * 2); // reflection / highlight
        }
        else if (this.distance <= mouse.radius){
            this.size = 10;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 2, this.y -2, this.size/3, 0, Math.PI * 2); // reflection / highlight - 1 moves the highlingt to the side.
        } else {
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 1, this.y -1, this.size/3, 0, Math.PI * 2); // reflection / highlight - 1 moves the highlingt to the side.
        }

        ctx.closePath();
        ctx.fill();
    }
    // calculate the distance between x and y points.
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy); // Pythagoras theorem to find the sum of the square of the hypotenuse.
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;


        if (distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}
// init function uses the blueprint to fill particles.
function init() {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 15, positionY * 15)); // adjust the positionX and PosY values to scale particle text.
            }
        }
    }
    
}
init();
// This is the animation loop, redrawing particles to the canvas.
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    //connect(); // ------ Disabling this wireframe function for the bubble effect -------
    requestAnimationFrame(animate); // the recursive loop.
}
animate();
// ------ NOT USED FOR BUBBLE TEXT ------
function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - (distance/75); // the higher this divisional value is the less opacity is applied.
            ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';

            if (distance < 25){ // try different numbers here for the best results...warning, keep them lower the more letters you want to display.

                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();

            }
        }
    }
}

