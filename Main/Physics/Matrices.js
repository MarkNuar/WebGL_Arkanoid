var hideMatrix = utils.MakeWorld(0,0,0,0,0,0,0);

// ball matrix
var ballMatrix = utils.MakeWorld(0,0,0,0,0,0,1);

// bricks matrices
var brickMatrix0 = utils.MakeWorld(-30,5,0,0,0,0,1);
var brickMatrix1 = utils.MakeWorld(-25,5,0,0,0,0,1);
var brickMatrix2 = utils.MakeWorld(-20,5,0,0,0,0,1);
var brickMatrix3 = utils.MakeWorld(-15,5,0,0,0,0,1);
var brickMatrix4 = utils.MakeWorld(-10,5,0,0,0,0,1);
var initialBrickMatrices = [ // used for restoring game to initial state
    brickMatrix0,
    brickMatrix1,
    brickMatrix2,
    brickMatrix3,
    brickMatrix4
];
var currentBrickMatrices = [
    brickMatrix0,
    brickMatrix1,
    brickMatrix2,
    brickMatrix3,
    brickMatrix4
];

// walls matrices
var wallMatrixR = utils.MakeWorld(-30,5,0,0,0,0,1);
var wallMatrixL = utils.MakeWorld(-30,5,0,0,0,0,1);
var wallMatrixU = utils.MakeWorld(-30,5,0,0,0,0,1);
var currentWallMatrices = [
    wallMatrixR,
    wallMatrixL,
    wallMatrixU
]

// paddle matrix
var paddleMatrix = utils.MakeWorld(0,-10,0,0,0,0,1);



function getBallMatrix(ballX, ballY)
{
    return utils.MakeWorld(ballX, ballY, 0, 0, 0, 0, 1);
}

function getBrickMatrix(brickIndex, disabled)
{
    if(disabled)
    {
        return hideMatrix;
    }
    else
    {
        return currentBrickMatrices[brickIndex];
    }
}

function getPaddleMatrix(paddleX)
{
    return utils.MakeWorld(paddleX, 0,0,0,0,0,1);
}