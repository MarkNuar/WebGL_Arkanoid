class Brick {
    constructor(position, scale)
    {
        this.position = position;
        this.scale = scale;
        this.hasChanged = false;

        this.canBeDisabled = true;
        this.disabled = false;
        this.isPaddle = false;
    }

    /**
     * Disable the current brick
     */
    disable()
    {
        if(this.canBeDisabled)
        {
            this.disabled = true;
            this.position = new Vec2(0,0);
            this.scale = new Vec2(0,0);
            this.hasChanged = true;
        }
    }
}