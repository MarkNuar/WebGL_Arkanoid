class Wall 
{
    constructor(position, size)
    {
        this.position = position;
        this.size = size;
        this.canBeDisabled = false;
        this.disabled = false;
        this.isPaddle = false;
    }
}