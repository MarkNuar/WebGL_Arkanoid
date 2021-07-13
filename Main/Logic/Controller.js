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

// input managmenet
let inputDisabled = false;

function initializeObjects()
{
    /**
     * x goes from right to left
     * y goes from up to down
     */

    ball = new Ball(new Vec2(0, 8), new Vec2(0.6, 0.6));
    paddle = new Paddle(new Vec2(0, 14.5), new Vec2(2, 0.5));

    wallR = new Wall(new Vec2(-10.5, 0), new Vec2(0.5, 15));
    wallL = new Wall(new Vec2(10.5, 0), new Vec2(0.5, 15));
    wallU = new Wall(new Vec2(0, -15), new Vec2(11, 0.5));

    brick0 = new Brick(new Vec2(0,0), new Vec2(1,1), true);
    brick1 = new Brick(new Vec2(0,0), new Vec2(0,0), true);

    brick2 = new Brick(new Vec2(0,0), new Vec2(0,0), true);
    brick3 = new Brick(new Vec2(0,0), new Vec2(0,0), true);
    brick4 = new Brick(new Vec2(0,0), new Vec2(0,0), true);

    objectsList = [
        ball,
        paddle,
        wallR,
        wallL,
        wallU,
        brick0,
        //TODO
        // brick1,
        // brick2,
        // brick3,
        // brick4
        // add other bricks ...
    ];

    wallsList = [
        wallR,
        wallL,
        wallU
    ];

    bricksList = [
        brick0,
        //TODO
        // brick1,
        // brick2,
        // brick3,
        // brick4
    ];
}
function initializeBallAndPaddle()
{
    ball = new Ball(new Vec2(0, 8), new Vec2(0.6, 0.6));
    paddle = new Paddle(new Vec2(0, 14.5), new Vec2(2, 0.5));

    ball.hasChanged = true;   // forces redrawn
    paddle.hasChanged = true; // forces redrawn

    objectsList[0] = ball;
    objectsList[1] = paddle;
}

function resetGame()
{
    initializeObjects(); // set up objects in the logical model
    forceUpdateMatrices(); // set up all the matrices from the previous initialized objects
}

function notifyBallDeath()
{
    if(lives>1)
    {
        // respawn ball
        initializeBallAndPaddle();
        lives--;
        updateScreenText();
    }
    else
    {
        initializeBallAndPaddle();
        lives--;
        updateScreenText();
        // stop receiving inputs
        window.removeEventListener("keydown", inputDown);
        window.removeEventListener("keyup", inputUp);
        inputDisabled = true;
        // TODO SHOW ENDGAME RESULTS
    }
}

// function to update the game state
function updateGameState()
{
    // update delta time 
    currentTime = (new Date).getTime();
    deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    // ball starts moving when the paddle is first moved
    if(!ball.moving && (paddle.moveLeft || paddle.moveRight))
    {
        console.log("start moving")
        ball.startMoving();
    }

    if(ball.moving)
    {
        ball.moveBall(deltaTime);

        // loop over all objects in level and check collision with them
        bricksList.forEach(brick => {
            ball.checkAndHandleCollision(brick);
            if(brick.hasChanged) // brick disabled
            {
                //todo manager brick counter and end game
            }
        });

        wallsList.forEach(wall => {
            ball.checkAndHandleCollision(wall);
        });

        ball.checkAndHandleCollision(paddle);
    }

    paddle.movePaddle(deltaTime);

    // TODO IF ALL BRICKS SHOW ENDGAME RESULTS
}

//add listeners on key bindings to move objects
window.addEventListener("keydown", inputDown);
window.addEventListener("keyup", inputUp);

window.addEventListener("keydown", reset);

function inputDown(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //move paddle to left
        paddle.moveLeft = true;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //move paddle to right
        paddle.moveRight = true;
    }
}

function reset(e){
    if (e.keyCode === 13) { // press enter
        resetGame();
        if(inputDisabled)
        {
            window.addEventListener("keydown", inputDown);
            window.addEventListener("keyup", inputUp);
            inputDisabled = false;
        }
    }
}

function inputUp(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //stop moving paddle to left
        paddle.moveLeft = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //stop moving paddle to right
        paddle.moveRight = false;
    }
}