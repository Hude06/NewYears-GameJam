import {Point, Bounds, Size} from "./node_modules/josh_js_util/dist/index.js"

const CANVAS_SIZE = new Size(600,400)

const FRICTION = 0.95
let canvas = null
let ctx = null

function setup_canvas() {
    canvas = document.getElementById("Gamewindow");
    ctx = (canvas.getContext("2d"));
    ctx.canvas.width  = CANVAS_SIZE.w;
    ctx.canvas.height = CANVAS_SIZE.h;
}



let cureentKeys = new Map();
let powerup = new Bounds(new Point(50,50),new Size(20,20))
let Player = {
    alive: true,
    lives: 1,
    pos: new Point(25,100),
    velocity: new Point(0,0),
    gravity: new Point(0,5),
    grounded: true,
    speed:0.01,
}

function setup_player() {
    Player.alive = true
    Player.pos = new Point(25,100)
    Player.velocity = new Point(0,0)
    Player.gravity = new Point(0,0.1)
    Player.grounded = false
}

let setHeight = null;
let setWidth = null;

const JUMP_POWER = -8


function GravityFalling() {
    // update velocity from gravity
    Player.velocity = Player.velocity.add(Player.gravity)

    // if hit the ground
    if (Player.pos.y >= 400) {
        Player.pos.y = 400
        Player.velocity.y = 0
        Player.grounded = true
        // if on the ground, then friction slows down velocity
        Player.velocity = Player.velocity.scale(FRICTION)
    }

    // if jump and on ground
    if (cureentKeys.get(' ') === true && Player.grounded === true) {
        Player.velocity = new Point(0,JUMP_POWER)
        Player.grounded = false;
    }

    // update position from velocity
    Player.pos = Player.pos.add(Player.velocity)

    // console.log('vel',Player.velocity)

}
let Platform = new Bounds(new Point(40,340),new Size(80,10))

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
    powerup.position = new Point(NUM,300-powerup.size.h)
    console.log(NUM)
}
function DrawRandomePlatform() {
    ctx.fillStyle = 'red'
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
    ctx.fillRect(Platform.position.x,Platform.position.y,Platform.size.w,Platform.size.h)
    ctx.fillStyle = "black"
}
const RUN_SPEED = new Point(0.5,0)
const MAX_RUN_SPEED = 10
function movePlayer() {
    if (cureentKeys.get("d") === true || cureentKeys.get('ArrowRight') === true) {
        Player.velocity = Player.velocity.add(RUN_SPEED)
        if(Player.velocity.x > MAX_RUN_SPEED) Player.velocity.x = MAX_RUN_SPEED
    }
    if (cureentKeys.get("a") === true || cureentKeys.get('ArrowLeft') === true) {
        Player.velocity = Player.velocity.subtract(RUN_SPEED)
        if(Player.velocity.x < -MAX_RUN_SPEED) Player.velocity.x = -MAX_RUN_SPEED
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
        ctx.fillStyle = 'black'
        ctx.fillRect(Player.pos.x - 25,Player.pos.y - 50,50,50);
    }
}
function POWERUP() {
    ctx.fillStyle = "blue"
    ctx.fillRect(powerup.position.x,powerup.position.y,powerup.size.w,powerup.size.h)
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
    setup_canvas()
    setupKeyboard();
    PlatformRandome();
    setup_player()
    LOOP();
}
