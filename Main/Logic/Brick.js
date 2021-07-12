class Brick 
{
    constructor(position, scale)
    {
        this.position = position;
        this.scale = scale;
        this.hasChanged = false;

        this.canBeDisabled = true;
        this.disabled = false;
        this.isPaddle = false;
    }

    disable()
    {
        this.disabled = true;
        this.scale = new Vec2(0,0);
        this.hasChanged = true;
    }
}