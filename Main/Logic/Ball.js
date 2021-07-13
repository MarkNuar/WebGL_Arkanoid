class Ball 
{
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

    initialBallVelocity;
    startAngleDeg;
    startAngleRad;
    
    startMoving() 
    {
        this.moving = true;
        this.startAngleDeg = 90*Math.random() + 225;
        this.startAngleRad = utils.degToRad(this.startAngleDeg);
        this.velocity = new Vec2(Math.cos(this.startAngleRad),Math.sin(this.startAngleRad));
        this.initialBallVelocity = this.velocity;
        this.velocity.scale(this.speed);
    }

    moveBall(deltaTime)
    {
        this.position = this.position.add(this.velocity.normalize().scale(this.speed * deltaTime));
        this.hasChanged = true;
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

        let aabbhalfExtents = new Vec2(otherObject.scale.x, otherObject.scale.y);
        let aabbPosition = otherObject.position;

        let difference = new Vec2(ballPosition.x - aabbPosition.x, ballPosition.y - aabbPosition.y);

        let clamped = new Vec2(
            this.clamp(difference.x, -aabbhalfExtents.x, aabbhalfExtents.x),
            this.clamp(difference.y, -aabbhalfExtents.y, aabbhalfExtents.y)
        );
        
        let closest = aabbPosition.add(clamped);

        difference = closest.sub(ballPosition);

        if(difference.getModule() < ballRadius)
        {
            console.log(otherObject.disabled);
            this.handleCollision(otherObject, difference);
        }
    }

    handleCollision(otherObject, difference)
    {
        if(otherObject.isPaddle) // just hit the player
        {
            let paddleCenter = otherObject.position.x + otherObject.scale.x;
            let distance = (this.position.x + this.radius) - paddleCenter;
            let percentage = distance/(otherObject.scale.x);

            let strength = 2;
            let oldVelocity = this.velocity;
            this.velocity.x = this.initialBallVelocity.x * percentage * strength;
            this.velocity.y = -1.0 * Math.abs(this.velocity.y);
            this.velocity = (this.velocity.normalize()).scale(oldVelocity.getModule());
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
                    this.position.x += penetration;
                }
                else
                {
                    this.position.x -= penetration;
                }
            }
            else
            {
                this.velocity.y = -this.velocity.y;
                let penetration = this.radius - Math.abs(difference.y)
                if(collisionDirection === 0)
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