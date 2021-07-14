// time management
let lastUpdateTime = (new Date).getTime();
let currentTime;
let deltaTime;

// game variables
let recordScore = 0;
let currentScore = 0;
let hasGameEnded = false;
let maxLives = 3;
let currentLives = 3;
let maxNumBricks = 0;
let currentNumBricks = 0;



// ball
let ball = null;

// paddle
let paddle = null;

// bricks
let brickY0 = null;
let brickY1 = null;
let brickY2 = null;
let brickY3 = null;
let brickY4 = null;
let brickY5 = null;
let brickY6 = null;
let brickY7 = null;
let brickY8 = null;
let brickY9 = null;
let brickY10 = null;
let brickY11 = null;
let brickY12 = null;

let brickG0 = null;
let brickG1 = null;
let brickG2 = null;
let brickG3 = null;
let brickG4 = null;
let brickG5 = null;
let brickG6 = null;
let brickG7 = null;
let brickG8 = null;
let brickG9 = null;
let brickG10 = null;
let brickG11 = null;
let brickG12 = null;

let brickP0 = null;
let brickP1 = null;
let brickP2 = null;
let brickP3 = null;
let brickP4 = null;
let brickP5 = null;
let brickP6 = null;
let brickP7 = null;
let brickP8 = null;
let brickP9 = null;
let brickP10 = null;
let brickP11 = null;
let brickP12 = null;

let brickR0 = null;
let brickR1 = null;
let brickR2 = null;
let brickR3 = null;
let brickR4 = null;
let brickR5 = null;
let brickR6 = null;
let brickR7 = null;
let brickR8 = null;
let brickR9 = null;
let brickR10 = null;
let brickR11 = null;
let brickR12 = null;

let brickN0 = null;
let brickN1 = null;
let brickN2 = null;
let brickN3 = null;
let brickN4 = null;
let brickN5 = null;
let brickN6 = null;
let brickN7 = null;
let brickN8 = null;
let brickN9 = null;
let brickN10 = null;
let brickN11 = null;
let brickN12 = null;

let bricksList = null;

// walls
let wallR = null;
let wallL = null;
let wallU = null;
let wallsList = null

// objects list
let objectsList = null;

// input management
let inputDisabled = false;

function initializeObjects()
{
    /**
     * x goes from right to left
     * y goes from up to down
     */

    ball = new Ball(new Vec2(0, 16), new Vec2(0.3, 0.3));
    paddle = new Paddle(new Vec2(0, 17.75), new Vec2(1.5, 0.25));

    wallR = new Wall(new Vec2(-15, 4), new Vec2(0.5, 14));
    wallL = new Wall(new Vec2(15, 4), new Vec2(0.5, 14));
    wallU = new Wall(new Vec2(0, -9.5), new Vec2(15, 0.5));

    brickG0 = new Brick(new Vec2(0,0), new Vec2(1,0.5));
    brickG1 = new Brick(new Vec2(-2.1,0), new Vec2(1,0.5));
    brickG2 = new Brick(new Vec2(-4.2,0), new Vec2(1,0.5));
    brickG3 = new Brick(new Vec2(-6.3,0), new Vec2(1,0.5));
    brickG4 = new Brick(new Vec2(-8.4,0), new Vec2(1,0.5));
    brickG5 = new Brick(new Vec2(-10.5, 0), new Vec2(1,0.5));
    brickG6 = new Brick(new Vec2(-12.6,0), new Vec2(1,0.5));
    brickG7 = new Brick(new Vec2(2.1,0), new Vec2(1,0.5));
    brickG8 = new Brick(new Vec2(4.2,0), new Vec2(1,0.5));
    brickG9 = new Brick(new Vec2(6.3,0), new Vec2(1,0.5));
    brickG10 = new Brick(new Vec2(8.4,0), new Vec2(1,0.5));
    brickG11 = new Brick(new Vec2(10.5,0), new Vec2(1,0.5));
    brickG12 = new Brick(new Vec2(12.6,0), new Vec2(1,0.5));

    brickP0 = new Brick(new Vec2(0,-1.1), new Vec2(1,0.5));
    brickP1 = new Brick(new Vec2(-2.1,-1.1), new Vec2(1,0.5));
    brickP2 = new Brick(new Vec2(-4.2,-1.1), new Vec2(1,0.5));
    brickP3 = new Brick(new Vec2(-6.3,-1.1), new Vec2(1,0.5));
    brickP4 = new Brick(new Vec2(-8.4,-1.1), new Vec2(1,0.5));
    brickP5 = new Brick(new Vec2(-10.5, -1.1), new Vec2(1,0.5));
    brickP6 = new Brick(new Vec2(-12.6,-1.1), new Vec2(1,0.5));
    brickP7 = new Brick(new Vec2(2.1,-1.1), new Vec2(1,0.5));
    brickP8 = new Brick(new Vec2(4.2,-1.1), new Vec2(1,0.5));
    brickP9 = new Brick(new Vec2(6.3,-1.1), new Vec2(1,0.5));
    brickP10 = new Brick(new Vec2(8.4,-1.1), new Vec2(1,0.5));
    brickP11 = new Brick(new Vec2(10.5,-1.1), new Vec2(1,0.5));
    brickP12 = new Brick(new Vec2(12.6,-1.1), new Vec2(1,0.5));

    brickY0 = new Brick(new Vec2(0,-2.2), new Vec2(1,0.5));
    brickY1 = new Brick(new Vec2(-2.1,-2.2), new Vec2(1,0.5));
    brickY2 = new Brick(new Vec2(-4.2,-2.2), new Vec2(1,0.5));
    brickY3 = new Brick(new Vec2(-6.3,-2.2), new Vec2(1,0.5));
    brickY4 = new Brick(new Vec2(-8.4,-2.2), new Vec2(1,0.5));
    brickY5 = new Brick(new Vec2(-10.5, -2.2), new Vec2(1,0.5));
    brickY6 = new Brick(new Vec2(-12.6,-2.2), new Vec2(1,0.5));
    brickY7 = new Brick(new Vec2(2.1,-2.2), new Vec2(1,0.5));
    brickY8 = new Brick(new Vec2(4.2,-2.2), new Vec2(1,0.5));
    brickY9 = new Brick(new Vec2(6.3,-2.2), new Vec2(1,0.5));
    brickY10 = new Brick(new Vec2(8.4,-2.2), new Vec2(1,0.5));
    brickY11 = new Brick(new Vec2(10.5,-2.2), new Vec2(1,0.5));
    brickY12 = new Brick(new Vec2(12.6,-2.2), new Vec2(1,0.5));

    brickR0 = new Brick(new Vec2(0,-3.3), new Vec2(1,0.5));
    brickR1 = new Brick(new Vec2(-2.1,-3.3), new Vec2(1,0.5));
    brickR2 = new Brick(new Vec2(-4.2,-3.3), new Vec2(1,0.5));
    brickR3 = new Brick(new Vec2(-6.3,-3.3), new Vec2(1,0.5));
    brickR4 = new Brick(new Vec2(-8.4,-3.3), new Vec2(1,0.5));
    brickR5 = new Brick(new Vec2(-10.5, -3.3), new Vec2(1,0.5));
    brickR6 = new Brick(new Vec2(-12.6,-3.3), new Vec2(1,0.5));
    brickR7 = new Brick(new Vec2(2.1,-3.3), new Vec2(1,0.5));
    brickR8 = new Brick(new Vec2(4.2,-3.3), new Vec2(1,0.5));
    brickR9 = new Brick(new Vec2(6.3,-3.3), new Vec2(1,0.5));
    brickR10 = new Brick(new Vec2(8.4,-3.3), new Vec2(1,0.5));
    brickR11 = new Brick(new Vec2(10.5,-3.3), new Vec2(1,0.5));
    brickR12 = new Brick(new Vec2(12.6,-3.3), new Vec2(1,0.5));

    brickN0 = new Brick(new Vec2(0,-4.4), new Vec2(1,0.5));
    brickN1 = new Brick(new Vec2(-2.1,-4.4), new Vec2(1,0.5));
    brickN2 = new Brick(new Vec2(-4.2,-4.4), new Vec2(1,0.5));
    brickN3 = new Brick(new Vec2(-6.3,-4.4), new Vec2(1,0.5));
    brickN4 = new Brick(new Vec2(-8.4,-4.4), new Vec2(1,0.5));
    brickN5 = new Brick(new Vec2(-10.5, -4.4), new Vec2(1,0.5));
    brickN6 = new Brick(new Vec2(-12.6,-4.4), new Vec2(1,0.5));
    brickN7 = new Brick(new Vec2(2.1,-4.4), new Vec2(1,0.5));
    brickN8 = new Brick(new Vec2(4.2,-4.4), new Vec2(1,0.5));
    brickN9 = new Brick(new Vec2(6.3,-4.4), new Vec2(1,0.5));
    brickN10 = new Brick(new Vec2(8.4,-4.4), new Vec2(1,0.5));
    brickN11 = new Brick(new Vec2(10.5,-4.4), new Vec2(1,0.5));
    brickN12 = new Brick(new Vec2(12.6,-4.4), new Vec2(1,0.5));




    objectsList = [
        ball,
        paddle,
        wallR,
        wallL,
        wallU,

        brickG0,
        brickG1,
        brickG2,
        brickG3,
        brickG4,
        brickG5,
        brickG6,
        brickG7,
        brickG8,
        brickG9,
        brickG10,
        brickG11,
        brickG12,

        brickP0,
        brickP1,
        brickP2,
        brickP3,
        brickP4,
        brickP5,
        brickP6,
        brickP7,
        brickP8,
        brickP9,
        brickP10,
        brickP11,
        brickP12,

        brickY0,
        brickY1,
        brickY2,
        brickY3,
        brickY4,
        brickY5,
        brickY6,
        brickY7,
        brickY8,
        brickY9,
        brickY10,
        brickY11,
        brickY12,

        brickR0,
        brickR1,
        brickR2,
        brickR3,
        brickR4,
        brickR5,
        brickR6,
        brickR7,
        brickR8,
        brickR9,
        brickR10,
        brickR11,
        brickR12,

        brickN0,
        brickN1,
        brickN2,
        brickN3,
        brickN4,
        brickN5,
        brickN6,
        brickN7,
        brickN8,
        brickN9,
        brickN10,
        brickN11,
        brickN12



        // add other bricks ...
    ];

    wallsList = [
        wallR,
        wallL,
        wallU
    ];

    bricksList = [
        brickG0,
        brickG1,
        brickG2,
        brickG3,
        brickG4,
        brickG5,
        brickG6,
        brickG7,
        brickG8,
        brickG9,
        brickG10,
        brickG11,
        brickG12,

        brickP0,
        brickP1,
        brickP2,
        brickP3,
        brickP4,
        brickP5,
        brickP6,
        brickP7,
        brickP8,
        brickP9,
        brickP10,
        brickP11,
        brickP12,

        brickY0,
        brickY1,
        brickY2,
        brickY3,
        brickY4,
        brickY5,
        brickY6,
        brickY7,
        brickY8,
        brickY9,
        brickY10,
        brickY11,
        brickY12,

        brickR0,
        brickR1,
        brickR2,
        brickR3,
        brickR4,
        brickR5,
        brickR6,
        brickR7,
        brickR8,
        brickR9,
        brickR10,
        brickR11,
        brickR12,

        brickN0,
        brickN1,
        brickN2,
        brickN3,
        brickN4,
        brickN5,
        brickN6,
        brickN7,
        brickN8,
        brickN9,
        brickN10,
        brickN11,
        brickN12
    ];

    //maxNumBricks = bricksList.length;
    maxNumBricks = bricksList.length;
    currentNumBricks = maxNumBricks;
}
function initializeBallAndPaddle()
{
    ball = new Ball(new Vec2(0, 16), new Vec2(0.3, 0.3));
    paddle = new Paddle(new Vec2(0, 17.75), new Vec2(1.5, 0.25));

    ball.hasChanged = true;   // forces redrawn
    paddle.hasChanged = true; // forces redrawn

    objectsList[0] = ball;
    objectsList[1] = paddle;
}

function resetGame()
{
    initializeObjects(); // set up objects in the logical model
    forceUpdateMatrices(); // set up all the matrices from the previous initialized objects
    hasGameEnded = false;
    currentLives = maxLives;
    currentNumBricks = maxNumBricks;
    updateScreenText();
}

function notifyBallDeath()
{
    initializeBallAndPaddle();
    currentLives--;
    if(currentLives>0)
    {
        // respawn ball
        updateScreenText();
    }
    else
    {
        recordScore = currentScore;
        currentScore = 0;
        hasGameEnded = true;
        updateScreenText();
        // stop receiving inputs
        window.removeEventListener("keydown", inputDown);
        window.removeEventListener("keyup", inputUp);
        inputDisabled = true;
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
                currentNumBricks--;
                currentScore+= 10;
                if(currentNumBricks === 0)
                {
                    currentScore += currentLives * 5;
                    recordScore = currentScore;
                    currentScore = 0;
                    initializeBallAndPaddle();
                    hasGameEnded = true;
                    updateScreenText();
                    // stop receiving inputs
                    window.removeEventListener("keydown", inputDown);
                    window.removeEventListener("keyup", inputUp);
                    inputDisabled = true;
                }
                else
                {
                    updateScreenText();
                }
            }
        });

        wallsList.forEach(wall => {
            ball.checkAndHandleCollision(wall);
        });

        ball.checkAndHandleCollision(paddle);
    }

    paddle.movePaddle(deltaTime);
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
    if (e.key === "2")
    {
        PMatrix = utils.MakeProjection(gl.canvas.width/45, gl.canvas.width / gl.canvas.height, 1, 100);
    }
    if (e.key === "3")
    {
        PMatrix = utils.MakePerspective(45, gl.canvas.width / gl.canvas.height, 1, 100);
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