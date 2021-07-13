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
function forceUpdateMatrices()
{
    for(let i = 0; i < objectsList.length; i++)
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
        currentObject.hasChanged = false;
    }
}

