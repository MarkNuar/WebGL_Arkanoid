class Wall 
{
    constructor(position, scale)
    {
        this.position = position;
        this.scale = scale;
        this.hasChanged = false;

        this.canBeDisabled = false;
        this.disabled = false;
        this.isPaddle = false;
    }
}