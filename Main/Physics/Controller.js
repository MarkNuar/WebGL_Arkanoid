

// function to update the game state
function updateGameState()
{
    // all i can see is emptiness
}




//add listeners on key bindings to move objects
window.addEventListener("keydown", onKeyPressed);
window.addEventListener("keyup", onKeyReleased);

function onKeyPressed(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //move paddle to left
        //paddle.moveLeft = true;
        //paddle.moveRight = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //move paddle to right
        //paddle.moveLeft = false;
        //paddle.moveRight = true;
    }
}

function onKeyReleased(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //stop moving paddle to left
        //paddle.moveLeft = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //stop moving paddle to right
        //paddle.moveRight = false;
    }
}