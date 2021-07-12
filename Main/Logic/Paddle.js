class Paddle 
{
    constructor(position, scale)
    {
        this.position = position;
        this.scale = scale;
        this.hasChanged = false;

        this.canBeDisabled = false;
        this.disabled = false;
        this.isPaddle = true;
        this.speed = PADDLE_SPEED;
    }

    moveLeft = false;
    moveRight = false;

    movePaddle(deltaTime)
    {
        if(this.moveLeft)
        {
            this.hasChanged = true;
            this.position.x -= this.speed * deltaTime;
        }
        else if(this.moveRight)
        {
            this.hasChanged = true;
            this.position.x += this.speed * deltaTime;
        }
    }
}