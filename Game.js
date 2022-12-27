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
    posy: 400,
    grounded: true,
    velocity: -0.1,
    speed:0.01,
}
let setHeight = null;
let setWidth = null;

function GravityFalling() {
    if (Player.grounded === false){
        Player.speed = Player.velocity + Player.speed
    }
    if (cureentKeys.get(' ') === true && Player.grounded === true) {
        Player.posy -= 100;
        Player.grounded = false;
    }
    if (Player.posy >= 400) {
        // console.log("GROUND")
        Player.grounded = true
        Player.posy = 400
        Player.speed = 0.01
    }
    if (Player.grounded === false) {
        Player.posy -= Player.speed
    }
    if (Player.posy >= Platform.posy && Player.posx <= Platform.posx) {
        Player.grounded = true
        Player.speed = 0.01
        // console.log("FLOOR")
    }
    // console.log("Vel" + Player.velocity)
    // console.log("Speed" + Player.speed)
    // console.log("POSY" + Player.posy)
}
let Platform = {
    posx: 40,
    posy: 340,
}
let FogStats = {
    fogH: 10,
    fogW: 10000,
    Transparence: 0.5,
    Speed:0.001,
    point:0,
    moving: true,
}
function FogIncrease() {
    if (FogStats.moving === true) {
        for (let i = 0; i < 100; i++) {
            FogStats.fogH+=FogStats.Speed;
        }
    }
}
function Points() {
    if (Player.alive === true) {
        for (let i = 0; i < 50; i++) {
            FogStats.point += 0.001;
            // console.log(Math.round(FogStats.point))
            ctx.textAlign = "center";
            // console.log(Player.alive)
            ctx.font="30px Comic Sans MS";
            ctx.fillText("Points: " + Math.round(FogStats.point), canvas.width/2, 100);
        }
    } else {
        ctx.fillText("Points: " + Math.round(FogStats.point), canvas.width/2, 100);
    }
}
function CheckFogHeight(){
    // console.log(400 - Player.posy)
    if (FogStats.fogH >= 50 + 400 - Player.posy) {
        Player.alive = false;
        // console.log("DEAD")
        FogStats.moving = false;
        ctx.textAlign = "center";
        ctx.font="30px Comic Sans MS";
        ctx.fillText("You Died", canvas.width/2, canvas.height/2);
    }
}
let NUM = null;
function PlatformRandome() {
    // Returns a random integer from 0 to 100:
    NUM = Math.floor(Math.random() * 300);
    console.log(NUM)
}
function DrawRandomePlatform() {
    ctx.fillRect(NUM,300,100,10);
}

function FOG(){
    ctx.fillStyle = "gray"
        ctx.globalAlpha = FogStats.Transparence;
        ctx.fillRect(0,400 - FogStats.fogH,FogStats.fogW,FogStats.fogH)
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "black"
}
function PLATFORM() {
    ctx.fillStyle = "red";
    ctx.fillRect(Platform.posx - 40,Platform.posy - 5,80,10)
    ctx.fillStyle = "black"
}
function movePlayer() {
    if (cureentKeys.get("d") === true) {
        // console.log("D")
        Player.posx+=5;
    }
    if (cureentKeys.get("a") === true) {
        // console.log("A")
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
    if (Player.alive === true) {
        ctx.fillRect(Player.posx - 25,Player.posy - 50,50,50);
    }
}
function POWERUP() {
    ctx.fillStyle = "blue"
    ctx.fillRect(NUM,NUM,20,20)
    ctx.fillStyle = "black"
}
function LOOP() {
    GravityFalling();
    DrawPlayer();
    movePlayer();
    PLATFORM();
    FOG();
    FogIncrease();
    CheckFogHeight();
    Points();
    DrawRandomePlatform()
    POWERUP();

    window.requestAnimationFrame(LOOP);
}


export function start_game() {
    setupKeyboard();
    PlatformRandome();
    LOOP();
}
