import {Point, Bounds, Size} from "./node_modules/josh_js_util/dist/index.js"
Bounds.prototype.intersects = function(bounds) {
    //check if each corner is inside the other bounds
    let p1 = new Point(this.position.x,this.position.y)
    if(bounds.contains(p1)) return true
    let p2 = new Point(this.position.x + this.size.w,this.position.y)
    if(bounds.contains(p2)) return true
    let p3 = new Point(this.position.x,this.position.y+this.size.h)
    if(bounds.contains(p3)) return true
    let p4 = new Point(this.position.x+this.size.w,this.position.y+this.size.h)
    if(bounds.contains(p4)) return true
    return false
}

const CANVAS_SIZE = new Size(600,400)

const FRICTION = 0.95
let canvas = null
let ctx = null
let tiles = null
// let Background = new Image();
// Background.src = "./Grafics/Background.png"
let BRICK_TILE = new Bounds(new Point(16*2,0), new Size(16,16))
let POWERUP_TILE = new Bounds(new Point(16*3,0), new Size(16,16))
let PLAYER_TILE = new Bounds(new Point(0,16), new Size(16,16))
let GROUND_TILE = new Bounds(new Point(16,16), new Size(16,16))
let BACKGROUND_TILE = new Bounds(new Point(0,0), new Size(16,16))

function setup_canvas() {
    canvas = document.getElementById("Gamewindow");
    ctx = (canvas.getContext("2d"));
    ctx.canvas.width  = CANVAS_SIZE.w;
    ctx.canvas.height = CANVAS_SIZE.h;
}



let cureentKeys = new Map();
let powerup = new Bounds(new Point(50,200),new Size(32,32))
let Player = {
    alive: true,
    lives: 1,
    pos: new Point(25,100),
    size: new Size(32,32),
    velocity: new Point(0,0),
    gravity: new Point(0,5),
    grounded: true,
    speed:0.01,
}

function setup_player() {
    Player.alive = true
    Player.pos = new Point(25,100)
    Player.size = new Size(32,32)
    Player.velocity = new Point(0,0)
    Player.gravity = new Point(0,0.1)
    Player.grounded = false
}


const JUMP_POWER = -5

const ground = new Bounds(new Point(-32*10,400-32),new Size(16*32*8,16*2))
const background = new Bounds(new Point(-32*10,0), new Size(32*40, 32*20))

function GravityFalling() {
    // update velocity from gravity
    Player.velocity = Player.velocity.add(Player.gravity)

    // if hit the ground
    if (Player.pos.y + Player.size.h >= ground.position.y) {
        Player.pos.y = ground.position.y - Player.size.h
        Player.velocity.y = 0
        Player.grounded = true
    }

    // if intersect with platform
    let player_bounds = new Bounds(Player.pos, Player.size)
    platforms.forEach(plat => {
        if(player_bounds.intersects(plat)) {
            Player.pos.y = plat.position.y - Player.size.h
            Player.velocity.y = 0
            Player.grounded = true
        }
    })

    // if on the ground, then friction slows down velocity
    if(Player.grounded) {
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
//let Platform = new Bounds(new Point(40,340),new Size(8*16,2*16))
let platforms = []
platforms.push(new Bounds(new Point(100,300), new Size(8*16, 2*16)))
platforms.push(new Bounds(new Point(200,200), new Size(8*16, 2*16)))

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
function draw_points() {
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
    // console.log("FogH" + FogStats.fogH)
    console.log(ground.position.y - Player.pos.y)
    // console.log("PosY" + ground.position.y - Player.pos.y)
    if (FogStats.fogH >= 32 + ground.position.y - Player.pos.y) {
        Player.alive = false;
        
        // console.log("DEAD")
        FogStats.moving = false;
        ctx.textAlign = "center";
        ctx.font="30px Comic Sans MS";
        ctx.fillText("You Died", canvas.width/2, canvas.height/2);
    }
}
function draw_background() {
    ctx.save()
    ctx.translate(current_scroll/2,0)
    fill_rect_with_tile(ctx,background,BACKGROUND_TILE)
    ctx.restore()
}
// let NUM = null;
// function PlatformRandome() {
//     // Returns a random integer from 0 to 100:
//     NUM = Math.floor(Math.random() * 300);
//     powerup.position = new Point(NUM,300-powerup.size.h)
//     // console.log(NUM)
// }
// function DrawRandomePlatform() {
//     let bounds = new Bounds(new Point(NUM,300), new Size(32*5,32))
//     fill_rect_with_tile(ctx,bounds,BRICK_TILE)
// }

function FOG(){
    ctx.fillStyle = "gray"
    ctx.globalAlpha = FogStats.Transparence;
    ctx.fillRect(0,400 - FogStats.fogH,FogStats.fogW,FogStats.fogH)
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "black"
}

function fill_rect_with_tile(ctx, rect, tile) {
    if(tiles) {
        let sc = 2
        ctx.save()
        ctx.translate(rect.position.x, rect.position.y)
        ctx.beginPath()
        ctx.rect(0, 0, rect.size.w, rect.size.h)
        ctx.clip()
        ctx.imageSmoothingEnabled = false
        for (let j = 0; j < rect.size.h; j = j + 16 * sc) {
            for (let i = 0; i < rect.size.w; i = i + 16 * sc) {
                ctx.drawImage(tiles,
                    tile.position.x, tile.position.y,
                    tile.size.w, tile.size.h,
                    i, j, 16 * sc, 16 * sc)
            }
        }
        ctx.restore()
        ctx.strokeStyle = "black";
        // ctx.strokeRect(rect.position.x,rect.position.y,rect.size.w,rect.size.h)
    }
}

let current_scroll = 0
function draw_platforms() {
    ctx.save()
    ctx.translate(current_scroll,0)
    fill_rect_with_tile(ctx,ground,GROUND_TILE)
    platforms.forEach(plat => fill_rect_with_tile(ctx,plat,BRICK_TILE))
    ctx.restore()
}
const RUN_SPEED = new Point(0.1,0)
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
    if (Player.alive === true) {
        ctx.save()
        ctx.translate(current_scroll,0)
        let player_bounds = new Bounds(Player.pos, Player.size)
        fill_rect_with_tile(ctx,player_bounds,PLAYER_TILE)
        ctx.restore()
        // ctx.fillStyle = 'black'
        // ctx.fillRect(Player.pos.x ,Player.pos.y ,Player.size.w,Player.size.h);
    }
    // console.log(cureentKeys.get === "Escape" == true)
}
function draw_powerups() {
    ctx.save();
    ctx.translate(current_scroll,0)
    if(powerup !== null) fill_rect_with_tile(ctx,powerup,POWERUP_TILE)
    ctx.restore();
}


function check_powerups() {
    let player_bounds = new Bounds(Player.pos, Player.size)
    if(powerup !== null && player_bounds.intersects(powerup)) {
        console.log("we are on top of the powerup")
        powerup = null
    }
}

function LOOP() {
    GravityFalling();
    check_powerups()
    movePlayer();
    current_scroll = -Player.pos.x+300
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_background();
    DrawPlayer();
    draw_platforms();
    FOG();
    FogIncrease();
    CheckFogHeight();
    draw_points();
    draw_powerups();
    // DrawRandomePlatform()
    //OpenMenuUI()

    window.requestAnimationFrame(LOOP);
}


function load_tiles() {
    tiles = new Image()
    tiles.addEventListener('load',() => {
        console.log("tile image is loaded",tiles)
    })
    tiles.src = "./risefall@1.png"
}

export function start_game() {
    load_tiles()
    setup_canvas()
    setupKeyboard();
    // PlatformRandome();
    setup_player()
    LOOP();
}
