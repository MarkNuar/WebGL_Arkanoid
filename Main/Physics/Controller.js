// time management
var lastUpdateTime = (new Date).getTime();
var currentTime; 
var deltaTime;

// create ball 
var ball = new Ball(new Vec2(4.6, 2));

// create bricks
var brick0 = new Brick(new Vec2(-30,5), new Vec2(10,5));
var brick1 = new Brick(new Vec2(-25,5), new Vec2(10,5));
var brick2 = new Brick(new Vec2(-20,5), new Vec2(10,5));
var brick3 = new Brick(new Vec2(-15,5), new Vec2(10,5));
var brick4 = new Brick(new Vec2(-10,5), new Vec2(10,5));
var brickList = [
    brick0,
    brick1, 
    brick2, 
    brick3,
    brick4
]

// create walls
var wallR = new Wall(new Vec2(0,0), new Vec2(0,0));
var wallL = new Wall(new Vec2(0,0), new Vec2(0,0));
var wallU = new Wall(new Vec2(0,0), new Vec2(0,0));
var wallList = [
    wallR, 
    wallL, 
    wallU
]

// create paddle
var paddle = new Paddle(new Vec2(0,-10), new Vec2(10,5));


// function to update the game state
function updateGameState()
{
    // update delta time 
    currentTime = (new Date).getTime();
    deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;


    ball.moveBall(deltaTime);

    // todo paddle move paddle (input, deltatime);

    // loop over all objects in level and check collision with them 
    brickList.forEach(brick => {
        ball.checkAndHandleCollision(brick);
    });

    wallList.forEach(wall => {
        ball.checkAndHandleCollision(wall);
    });
    
    ball.checkAndHandleCollision(paddle);
}




//add listeners on key bindings to move objects
window.addEventListener("keydown", onKeyPressed);
window.addEventListener("keyup", onKeyReleased);

function onKeyPressed(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //move paddle to left
        //paddle.moveLeft = true;
        //paddle.moveRight = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //move paddle to right
        //paddle.moveLeft = false;
        //paddle.moveRight = true;
    }
}

function onKeyReleased(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //stop moving paddle to left
        //paddle.moveLeft = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //stop moving paddle to right
        //paddle.moveRight = false;
    }
}