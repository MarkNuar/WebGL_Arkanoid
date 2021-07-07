class Ball 
{
    constructor(position)
    {
        this.initialPosition = position;
        this.position = position;
        this.velocity = new Vec2(0,0);
        this.speed = BALL_SPEED;
        this.radius = BALL_RADIUS;
    }

    initialBallVelocity;
    
    startMoving() 
    {
        startAngleDeg = 90*Math.random() + 45;
        startAngleRad = utils.degToRad(startAngleDeg);
        this.velocity = new Vec2(Math.cos(startAngleRad),Math.sin(startAngleRad));
        this.initialBallVelocity = this.velocity;
        this.velocity.scale(this.speed);
    }

    moveBall(deltaTime)
    {
        this.position = this.position.add(this.velocity.scale(deltaTime));
        
        // todo: if collision with wall, change direction
        // todo: if collision with deathWall (the one in the bottom) respawn ball
            // position = initialPosition
            // this.velocity = new Vec2(0,0);
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

        let otherObjectPosition = otherObject.position;
        let aabbhalfExtents = new Vec2(otherObject.size.x/2, otherObject.size.y/2);
        let aabbPosition = new Vec2(otherObjectPosition.x + aabbhalfExtents.x,
                	            otherObjectPosition.y + aabbhalfExtents.y);

        let difference = ballPosition - aabbPosition;
        let clamped = new Vec2(
            this.clamp(difference.x, -aabbhalfExtents.x, aabbhalfExtents.x),
            this.clamp(difference.y, -aabbhalfExtents.y, aabbhalfExtents.y)
        ); //TODO
        
        let closest = aabbPosition.add(clamped);

        difference = closest.sub(ballPosition);

        if(difference.getModule() < ballRadius)
            handleCollision(otherObject, difference)
    }

    handleCollision(otherObject, difference)
    {
        if(otherObject.isPaddle) // just hit the player
        {
            let paddleCenter = otherObject.position.x + otherObject.size.x/2;
            let distance = (this.position.x + this.radius) - paddleCenter;
            let percentage = distance/(otherObject.size.x/2);

            let strength = 2;
            let oldvelocity = this.velocity;
            this.velocity.x = this.initialBallVelocity.x * percentage * strength;
            this.velocity.y = -1.0 * Math.abs(this.velocity.y);
            this.velocity = (this.velocity.normalize()).scale(oldvelocity.getModule());
        }
        else // just hit a brick or wall
        {
            if(otherObject.canBeDisabled)
            {
                otherObject.disable();
            }
            let collisionDirection = this.getCollisionDirection(difference)
            if(collisionDirection == 3 || collisionDirection == 1)
            {
                this.speed.x = -this.speed.x;
                let penetration = this.radius - Math.abs(difference.x)
                if(collisionDirection == 3)
                {
                    this.position.x += penetration;
                }
                else
                {
                    this.position.x -= penetration;
                }
            }
            else
            {
                this.speed.y = -this.speed.y;
                let penetration = this.radius - Math.abs(difference.y)
                if(collisionDirection == 0)
                {
                    this.position.y -= penetration;
                }
                else
                {
                    this.position.y += penetration;
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