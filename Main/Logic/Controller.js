// time management
let lastUpdateTime = (new Date).getTime();
let currentTime;
let deltaTime;

// ball
let ball = null;

// paddle
let paddle = null;

// bricks
let brick0 = null;
let brick1 = null;
let brick2 = null;
let brick3 = null;
let brick4 = null;
let bricksList = null;

// walls
let wallR = null;
let wallL = null;
let wallU = null;
let wallsList = null

// objects list
let objectsList = null;

function initializeObjects()
{
    /**
     * x goes from right to left
     * y goes from up to down
     */

    ball = new Ball(new Vec2(0, 8), new Vec2(0.6, 0.6));
    paddle = new Paddle(new Vec2(0, 15), new Vec2(2, 0.5));

    wallR = new Wall(new Vec2(-10, 0), new Vec2(0.5, 15));
    wallL = new Wall(new Vec2(10, 0), new Vec2(0.5, 15));
    wallU = new Wall(new Vec2(0, -15), new Vec2(11, 0.5));

    brick0 = new Brick(new Vec2(0,0), new Vec2(1,1));
    brick1 = new Brick(new Vec2(0,0), new Vec2(0,0));

    brick2 = new Brick(new Vec2(0,0), new Vec2(0,0));
    brick3 = new Brick(new Vec2(0,0), new Vec2(0,0));
    brick4 = new Brick(new Vec2(0,0), new Vec2(0,0));

    objectsList = [
        ball,
        paddle,
        wallR,
        wallL,
        wallU,
        brick0,
        brick1,
        brick2,
        brick3,
        brick4
        // add other bricks ...
    ];

    wallsList = [
        wallR,
        wallL,
        wallU
    ];

    bricksList = [
        brick0,
        brick1,
        brick2,
        brick3,
        brick4
    ];
}

// function to update the game state
function updateGameState()
{
    // update delta time 
    currentTime = (new Date).getTime();
    deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    if(!ball.moving)
    {
        ball.startMoving();
    }
    else
    {
        // loop over all objects in level and check collision with them
        bricksList.forEach(brick => {
            ball.checkAndHandleCollision(brick);
        });
        wallsList.forEach(wall => {
            ball.checkAndHandleCollision(wall);
        });
        ball.checkAndHandleCollision(paddle);

        ball.moveBall(deltaTime);
    }

    paddle.movePaddle(deltaTime);

    // win condition (?)
}

//add listeners on key bindings to move objects
window.addEventListener("keydown", onKeyPressed);
window.addEventListener("keyup", onKeyReleased);

function onKeyPressed(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //move paddle to left
        paddle.moveLeft = true;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //move paddle to right
            paddle.moveRight = true;
    }
}

function onKeyReleased(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //stop moving paddle to left
        paddle.moveLeft = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //stop moving paddle to right
        paddle.moveRight = false;
    }
}