const canvas = document.getElementById("Gamewindow");
var ctx = (canvas.getContext("2d"));
ctx.canvas.width  = 600;
ctx.canvas.height = 400;
let cureentKeys = new Map();
let Player = {
    alive: true,
    gravity: 5,
    lives: 1,
    posx: 25,
    posy: 375,
    grounded: true,
    velocity: -0.1,
    speed:0.01,
}
function GravityFalling() {
    if (Player.grounded === false){
        Player.speed = Player.velocity + Player.speed
    }
    if (cureentKeys.get(' ') === true && Player.grounded === true) {
        Player.posy -= 100;
        Player.grounded = false;
    }
    if (Player.posy >= 375) {
        // console.log("GROUND")
        Player.grounded = true
        Player.posy = 375
        Player.speed = 0.01
    }
    if (Player.grounded === false) {
        Player.posy -= Player.speed
    }
    if (Player.posy >= Platform.posy && Player.posx >= Platform.posx) {
        Player.grounded = true
        console.log("FLOOR")
    }
    // console.log("Vel" + Player.velocity)
    // console.log("Speed" + Player.speed)
    // console.log("POSY" + Player.posy)
}
let Platform = {
    posx: 40,
    posy: 340,
}
function PLATFORM() {
    ctx.fillStyle = "red";
    ctx.fillRect(Platform.posx - 25,Platform.posy - 5,50,10)
    ctx.fillStyle = "black"
}
function movePlayer() {
    if (cureentKeys.get("d") === true) {
        console.log("D")
        Player.posx+=5;
    }
    if (cureentKeys.get("a") === true) {
        console.log("A")
        Player.posx-=5;
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
}
function DrawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.fillRect(Player.posx - 25,Player.posy - 25,50,50);
}
function LOOP() {
    GravityFalling();
    DrawPlayer();
    movePlayer();
    PLATFORM();
    window.requestAnimationFrame(LOOP);
}
setupKeyboard();
LOOP();