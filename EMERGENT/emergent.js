/*
  This is part of a project attempting to model "frisbee clustering" as demonstrated @ http://www.ai-junkie.com/competition.htm.  So 
  the basic idea is that there are a lot of frisbees and some robots.  The robots wander around and run into frisbees.  The robots have 
  a frisbee pusher that accomodates 1 frisbee.  If while pushing a frisbee, the robot runs into another frisbee, it will back away from 
  both frisbees and spin around and start wandering again.  Governed by those principles with some randomness thrown in, clusters of 
  frisbees emerge.  I have tried to follow these guidelines and sprinkled a little of my own randomness around as well.
*/

/**
 * Calculates the distance between two objects.
 *
 * @/// <param name="obj1" type="object">An object containing an X and Y value.</param>
 * @/// <param name="obj2" type="object">An object containing an X and Y value.</param>
 * @author PROVIDED
 */
function distance(obj1, obj2) {
    var dx = obj1.x - obj2.x;
    var dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Represents an object in the simulation.
 *
 * @author John Jackson
 * @author PROVIDED
 */
function Circle(game, isFrisbee) {
    this.player = 1;
    this.radius = 5;
    this.colors = ["Red","Green", "Blue", "White"];
    
    if (isFrisbee) {
        this.setNotIt();
    } else {
        this.setIt();
    }

    this.frisbee = null;

    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2 - 5), this.radius + Math.random() * (500 - this.radius * 2 - 5));
    
    //Generate a random vector for direction.
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };

    //Set speed
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

/**
 * Update a bot's vitals.
 *
 * @author John Jackson
 */
Circle.prototype.updateBot = function( x, y, hasFrisbee, velocity ) {
    this.x = x;
    this.y = y;
    this.hasFrisbee = hasFrisbee;
    console.log(velocity[0] + "," + velocity[1]);
    this.velocity = velocity;
}

/**
 * Update a frisbee's vitals.
 *
 * @author John Jackson
 */
Circle.prototype.updateFrisbee = function (x, y, isCaught) {
    this.x = x;
    this.y = y;
    this.isCaught = isCaught;
}

Circle.prototype.constructor = Circle;

/**
 * Detect a collision with bottom of frame.
 *
 * @return  *anonymous  <boolean>  True if this Circle is out of bounds.
 * @author John Jackson
 * @author PROVIDED
 */
Circle.prototype.setIt = function () {
    this.it = true;
    this.radius = 10;
    this.color = 0;
    this.visualRadius = 500;
    this.hasFrisbee = false;
};

/**
 * Detect a collision with bottom of frame.
 *
 * @return  *anonymous  <boolean>  True if this Circle is out of bounds.
 * @author John Jackson
 */
Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = Math.random() >.5 ? 3 : 2;
    this.visualRadius = 200;
    // Edits...
    this.isCaught = false;
    //
};

/**
 * Detect a collision with another circle.
 *
 * @return  *anonymous  <boolean>  True if there is a collision.
 * @author PROVIDED
 */
Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

/**
 * Detect a collision with left side of frame.
 *
 * @return  *anonymous  <boolean>  True if this Circle is out of bounds.
 * @author PROVIDED
 */
Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

/**
 * Detect a collision with right side of frame.
 *
 * @return  *anonymous  <boolean>  True if this Circle is out of bounds.
 * @author PROVIDED
 */
Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

/**
 * Detect a collision with top of frame.
 *
 * @return  *anonymous  <boolean>  True if this Circle is out of bounds.
 * @author PROVIDED
 */
Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

/**
 * Detect a collision with bottom of frame.
 *
 * @return  *anonymous  <boolean>  True if this Circle is out of bounds.
 * @author PROVIDED
 */
Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 500;
};

/**
 * Release a frisbee from a bot's possession.
 * 
 * @author John Jackson
 */
Circle.prototype.unsync = function () {
    this.frisbee.isCaught = false;
};

/**
 * Sync's a frisbee with a bot to simulate possession.
 *
 * @/// <param name="bot" type="Circle">The robot in possession of this frisbee.</param>
 * @author John Jackson
 */
Circle.prototype.sync = function (bot) {
    if (this.isCaught) {
        this.x = bot.x;
        this.y = bot.y;
    } else {
        this.frisbee = bot;
    }
};


Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (this.hasFrisbee && this.frisbee !== ent) {
                //If contact is made with a second frisbee...
                //Prevent frisbee pile up.
                Math.random() >= .5 ? this.frisbee.x -= 3 : this.frisbee.x += 3;
                Math.random() >= .5 ? ent.y -= 3 : ent.y + 3;

                //Reset affected state values
                this.frisbee.isCaught = false;
                this.hasFrisbee = false;
                this.frisbee = null;

                //Random path adjustment.
                Math.random() >= .33 ? this.velocity.x *= -1 : Math.random() >= .5 ? (this.velocity.y *= -1, this.velocity.x *= 1) : this.velocity.y *= -1;

            } else if (!this.hasFrisbee && !ent.it) {
                //If robot does not yet have a frisbee, aquire one.
                ent.isCaught = true;
                ent.sync(this);
                this.frisbee = ent;
                this.hasFrisbee = true;
            } else if (!this.it && !ent.it) {
                //Prevent frisbee pileup.
                this.x -= 3;
                ent.x += 3;
            }
        }
    }

    if (this.it) {
        //Update a synced frisbee if present.
        if (this.frisbee != null) {
            this.frisbee.x = this.x;
            this.frisbee.y = this.y;
        }

        //Update direction
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        //Check for bounds violations
        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x * friction;
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 800 - this.radius;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;

        }

        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y * friction;
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 500 - this.radius;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
        }
    }
    
};

/**
 * Draws a circle on screen.
 *
 * @/// <param name="ctx" type="Canvas.context">Context in which the canvas is drawn upon.</param>
 * @author John Jackson
 */
Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};