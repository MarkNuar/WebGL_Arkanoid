class Brick 
{
    constructor(position, size)
    {
        this.position = position;
        this.size = size;
        this.canBeDisabled = true;
        this.disabled = false;
        this.isPaddle = false;
    }

    disable()
    {
        this.disabled = true;
    }

    enable()
    {
        this.disabled = false;
    }
}