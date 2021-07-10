var hideMatrix = utils.MakeWorld(0,0,0,0,0,0,0);

// ball matrix
var ballMatrix = utils.MakeWorld(0,0,0,0,0,0,1);

// paddle matrix
var paddleMatrix = utils.MakeWorld(0,0,0,0,0,0,1);

// walls matrices
var wallMatrixR = utils.MakeWorld(30,0,0,0,0,0,10);
var wallMatrixL = utils.MakeWorld(-30,0,0,0,0,0,10);
var wallMatrixU = utils.MakeWorld(0,0,-25,0,0,0,10);

// bricks matrices
var brickMatrix0 = utils.MakeWorld(0,0,0,0,0,0,1);
var brickMatrix1 = utils.MakeWorld(0,0,0,0,0,0,1);
var brickMatrix2 = utils.MakeWorld(0,0,0,0,0,0,1);
var brickMatrix3 = utils.MakeWorld(0,0,0,0,0,0,1);
var brickMatrix4 = utils.MakeWorld(0,0,0,0,0,0,1);

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



function setBallMatrix(ballX, ballY)
{
    return utils.MakeWorld(ballX, 0, ballY, 0, 0, 0, 1);
}

function setBrickMatrix(matrixListIndex, disabled)
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

function setPaddleMatrix(paddleX, paddleY)
{
    return utils.MakeWorld(paddleX, 0,paddleY,0,0,0,1);
}