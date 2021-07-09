class Paddle 
{
    constructor(position, size)
    {
        this.position = position;
        this.size = size;
        this.canBeDisabled = false;
        this.disabled = false;
        this.isPaddle = false;
        this.speed = PADDLE_SPEED;
    }

    moveLeft = false;
    moveRight = false;

    movePaddle(deltaTime)
    {
        if(this.moveLeft)
        {
            this.position.x -= this.speed * deltaTime;
        }
        else if(this.moveRight)
        {
            this.position.x += this.speed * deltaTime;
        }
    }
}