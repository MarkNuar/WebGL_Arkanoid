var hideMatrix = utils.MakeWorld(0,0,0,0,0,0,0);

// ball matrix
var ballMatrix = utils.MakeWorld(0,0,0,0,0,0,1);

// paddle matrix
var paddleMatrix = utils.MakeWorld(0,-10,0,0,0,0,1);

// walls matrices
var wallMatrixR = utils.MakeWorld(-30,5,0,0,0,0,1);
var wallMatrixL = utils.MakeWorld(-30,5,0,0,0,0,1);
var wallMatrixU = utils.MakeWorld(-30,5,0,0,0,0,1);

// bricks matrices
var brickMatrix0 = utils.MakeWorld(-30,5,0,0,0,0,1);
var brickMatrix1 = utils.MakeWorld(-25,5,0,0,0,0,1);
var brickMatrix2 = utils.MakeWorld(-20,5,0,0,0,0,1);
var brickMatrix3 = utils.MakeWorld(-15,5,0,0,0,0,1);
var brickMatrix4 = utils.MakeWorld(-10,5,0,0,0,0,1);

// initial objects matrices for restoring game to initial state
var initialMatricesList = [ 
    ballMatrix,     // 0
    paddleMatrix,   // 1
    wallMatrixR,    // 2
    wallMatrixL,    // 3
    wallMatrixU,    // 4
    brickMatrix0,   // 5
    brickMatrix1,   // 6
    brickMatrix2,   // 7
    brickMatrix3,   // 8
    brickMatrix4    // 9
    // other bricks...
];

// 
var currentMatricesList = [
    ballMatrix,     // 0
    paddleMatrix,   // 1
    wallMatrixR,    // 2
    wallMatrixL,    // 3
    wallMatrixU,    // 4
    brickMatrix0,   // 5
    brickMatrix1,   // 6
    brickMatrix2,   // 7
    brickMatrix3,   // 8
    brickMatrix4    // 9
    // other bricks...
];



function getBallMatrix(ballX, ballY)
{
    return utils.MakeWorld(ballX, ballY, 0, 0, 0, 0, 1);
}

function getBrickMatrix(matrixListIndex, disabled)
{
    if(disabled)
    {
        return hideMatrix;
    }
    else
    {
        return currentMatricesList[matrixListIndex];
    }
}

function getPaddleMatrix(paddleX)
{
    return utils.MakeWorld(paddleX, 0,0,0,0,0,1);
}