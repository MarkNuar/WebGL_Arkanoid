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

let bricksList = [];

// walls
let wallR = null;
let wallL = null;
let wallU = null;
let wallsList = [];

// objects list
let objectsList = [];

// input management
let inputDisabled = false;

function initializeObjects()
{
    /**
     * x goes from right to left
     * y goes from up to down
     */

    objectsList = []; // reset if restarting game

    ball = new Ball(new Vec2(0, 16), new Vec2(0.3, 0.3));
    paddle = new Paddle(new Vec2(0, 17.75), new Vec2(1.5, 0.25));
    wallR = new Wall(new Vec2(-15, 4), new Vec2(0.5, 14));
    wallL = new Wall(new Vec2(15, 4), new Vec2(0.5, 14));
    wallU = new Wall(new Vec2(0, -9.5), new Vec2(15, 0.5));

    objectsList.push(ball, paddle, wallR, wallL, wallU);

    let xStart = -12.6;
    let xStep = 2.1;
    let yStep = 1.1;
    for (let j = 0; j < 5; j++)
    {
        for (let i = 0; i < 13; i++)
        {
            objectsList.push(new Brick(new Vec2(xStart+xStep*i, -yStep*j), new Vec2(1, 0.5)));
        }
    }

    wallsList = objectsList.slice(2, 5);
    bricksList = objectsList.slice(5, objectsList.length);

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

        ball.moveBall(deltaTime);
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

function onCheckBoxChange(value)
{
    if(value)
    {
        PMatrix = utils.MakePerspective(45, gl.canvas.width / gl.canvas.height, 1, 100);
    }
    else
    {
        PMatrix = utils.MakeProjection(gl.canvas.width/45, gl.canvas.width / gl.canvas.height, 1, 100);
    }
}