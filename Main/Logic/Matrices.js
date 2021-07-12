// ball matrix
let ballMatrix = null;

// paddle matrix
let paddleMatrix = null;

// walls matrices
let wallMatrixR = null;
let wallMatrixL = null;
let wallMatrixU = null;

// bricks matrices
let brickMatrix0 = null;
let brickMatrix1 = null;
let brickMatrix2 = null;
let brickMatrix3 = null;
let brickMatrix4 = null;

// initial objects matrices for restoring game to initial state
let initialMatricesList = [
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
let currentMatricesList = [
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

/***
 * remember that moving and scaling on y for the object in the controller
 * must result in a movement and scaling on the z for the matrix
 ***/
function updateObjectsMatrices()
{
    for(let i = 0; i < currentMatricesList.length; i++)
    {
        let currentObject = objectsList[i];
        if(currentObject.hasChanged)
        {
            currentMatricesList[i] = utils.createGenericWorldMatrix(
                currentObject.position.x,
                0, // always zero for this project
                currentObject.position.y,
                0, // always zero for this project
                0, // always zero for this project
                0, // always zero for this project
                currentObject.scale.x,
                1, // always one for this project
                currentObject.scale.y
            );
            currentObject.hasChanged = false;
        }
    }
}

// probably needed for restoring game to the initial view
function initializeObjectsMatrices()
{
    for(let i = 0; i < currentMatricesList.length; i++)
    {
        let currentObject = objectsList[i];
        currentMatricesList[i] = utils.createGenericWorldMatrix(
            currentObject.position.x,
            0, // always zero for this project
            currentObject.position.y,
            0, // always zero for this project
            0, // always zero for this project
            0, // always zero for this project
            currentObject.scale.x,
            1, // always one for this project
            currentObject.scale.y
        );
        initialMatricesList[i] = utils.createGenericWorldMatrix(
            currentObject.position.x,
            0, // always zero for this project
            currentObject.position.y,
            0, // always zero for this project
            0, // always zero for this project
            0, // always zero for this project
            currentObject.scale.x,
            1, // always one for this project
            currentObject.scale.y
        );
        currentObject.hasChanged = false;
    }
}

