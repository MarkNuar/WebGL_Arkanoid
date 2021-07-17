class Ball {
    constructor(position, scale)
    {
        this.position = position;
        this.scale = scale;
        this.hasChanged = false;

        this.velocity = new Vec2(0,0);
        this.speed = BALL_SPEED;
        this.radius = scale.x;
        this.moving = false;
    }


    startMoving() 
    {
        this.moving = true;
        let angle =  utils.degToRad(90*Math.random() + 225);
        this.velocity = new Vec2(Math.cos(angle),Math.sin(angle));
        this.velocity.scale(this.speed);
    }

    moveBall(deltaTime)
    {
        this.position = this.position.add(this.velocity.normalize().scale(this.speed * deltaTime));
        this.hasChanged = true;

        if(this.position.y > paddle.position.y + BALL_DEATH_PADDING) // ball under the paddle
        {
            notifyBallDeath();
        }
    }

    checkAndHandleCollision(otherObject)
    {
        if(otherObject.disabled)
        {
            return;  
        }
        // else
        let ballPosition = this.position;
        let ballRadius = this.radius;

        let otherHalfExtents = new Vec2(otherObject.scale.x, otherObject.scale.y);
        let otherPosition = otherObject.position;

        let difference = new Vec2(ballPosition.x - otherPosition.x, ballPosition.y - otherPosition.y);

        let clamped = new Vec2(
            this.clamp(difference.x, -otherHalfExtents.x, otherHalfExtents.x),
            this.clamp(difference.y, -otherHalfExtents.y, otherHalfExtents.y)
        );
        
        let closest = otherPosition.add(clamped);

        difference = closest.sub(ballPosition);

        if(difference.getModule() < ballRadius)
        {
            if(difference.getModule() === 0)
            {
                console.error("Zero vector for different");
            }
            console.log(otherObject.disabled);
            this.handleCollision(otherObject, difference);
        }
    }

    handleCollision(otherObject, difference)
    {
        if(otherObject.isPaddle) // just hit the player
        {
            this.velocity.y = - this.velocity.y;
            this.velocity.x += (this.position.x - otherObject.position.x)/2; // it's a kind of magic
            if(Math.abs(this.velocity.x) > 1.5 * Math.abs(this.velocity.y))
            {
                this.velocity.x = this.velocity.x/4;
            }
            this.velocity = this.velocity.normalize();
        }
        else // just hit a brick or wall
        {
            if(otherObject.canBeDisabled)
            {
                console.log("disabling");
                otherObject.disable();
                console.log(otherObject.disabled);
            }
            let collisionDirection = this.getCollisionDirection(difference)
            if(collisionDirection === 3 || collisionDirection === 1)
            {
                this.velocity.x = -this.velocity.x;
                let penetration = this.radius - Math.abs(difference.x)
                if(collisionDirection === 3)
                {
                    this.position.x += (penetration);
                }
                else
                {
                    this.position.x -= (penetration);
                }
            }
            else
            {
                this.velocity.y = -this.velocity.y;
                let penetration = this.radius - Math.abs(difference.y)
                if(collisionDirection === 0)
                {
                    this.position.y -= (penetration);
                }
                else
                {
                    this.position.y += (penetration);
                }
            }
        }        
    }

    getCollisionDirection(target)
    {
        target = target.normalize();

        let compass = [
            new Vec2(0,1), // up,       0
            new Vec2(1,0), // right,    1
            new Vec2(0,-1), // down,    2
            new Vec2(-1,0) // left,     3
        ]

        let max = 0;
        let bestMatch = -1;

        for (let i = 0; i < 4; i++) {
            let dotProduct = target.dot(compass[i]);
            if(dotProduct > max)
            {
                max = dotProduct;
                bestMatch = i;
            }
        }
        return bestMatch;
    }

    clamp = (num, min, max) => Math.min(Math.max(num, min), max);

}