const canvas = document.getElementById("Gamewindow");
var ctx = (canvas.getContext("2d"));
ctx.canvas.width  = 600;
ctx.canvas.height = 400;
let cureentKeys = new Map();
let Player = {
    alive: true,
    gravity: 5,
    lives: 1,
    posx: 0,
    posy: 350,
    grounded: true,
    velocity: -0.1,
    speed:0.01,
}
function GravityFalling() {
    if (Player.grounded === false){
        Player.speed = Player.velocity + Player.speed
    }
    if (cureentKeys.get(' ') === true && Player.grounded === true) {
        Player.posy -= 300;
        Player.grounded = false;
    }
    if (Player.posy >= 350) {
        // console.log("GROUND")
        Player.grounded = true
        Player.posy = 350
        Player.speed = 0.01
    }
    if (Player.grounded === false) {
        Player.posy -= Player.speed
    }
    // console.log("Vel" + Player.velocity)
    // console.log("Speed" + Player.speed)
    // console.log("POSY" + Player.posy)
}
function movePlayer() {
    if (cureentKeys.get("a") === true) {
        console.log("A")
        Player.posx
    }
}
function setupKeyboard() {
    window.addEventListener('keydown', function(event) {
        cureentKeys.set(event.key,true);
        if (event.repeat === true) {
            return;
        }    });
    window.addEventListener('keyup', function(event) {
        cureentKeys.set(event.key,false);
    });

    if (cureentKeys.get("a" === true)) {
        console.log("A")
    } 

}
function DrawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.fillRect(Player.posx,Player.posy,50,50);
}
function LOOP() {

    GravityFalling();
    DrawPlayer();
    movePlayer();
    window.requestAnimationFrame(LOOP);
}
setupKeyboard();
LOOP();