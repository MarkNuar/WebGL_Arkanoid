// current objects matrices
let currentMatricesList = [];

/***
 * remember that moving and scaling on y for the object in the controller
 * must result in a movement and scaling on the z for the matrix
 ***/
function updateMatrices()
{
    for(let i = 0; i < objectsList.length; i++)
    {
        let currentObject = objectsList[i];
        if(currentObject.hasChanged)
        {
            updateMatrix(currentObject, i);
        }
    }
}

// probably needed for restoring game to the initial view
function forceUpdateMatrices()
{
    for(let i = 0; i < objectsList.length; i++)
    {
        let currentObject = objectsList[i];
        updateMatrix(currentObject, i);
    }
}

function updateMatrix(object, index)
{
    currentMatricesList[index] = utils.createGenericWorldMatrix(
        object.position.x,
        0, // always zero for this project
        object.position.y,
        0, // always zero for this project
        0, // always zero for this project
        0, // always zero for this project
        object.scale.x,
        1, // always one for this project
        object.scale.y
    );
    object.hasChanged = false;
}

