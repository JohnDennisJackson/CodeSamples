/**
 * Health indicator.
 *
 * @author  Syrym Satanov
 * @author  John Jackson
 */
function Bar(game, the_fighter) {
    this.fighter = the_fighter;
    this.game = game;
    this.bar = this.fighter.isPlayer ? ASSET_MANAGER.getAsset("./img/lifebarLEFT.png") : ASSET_MANAGER.getAsset("./img/lifebarRIGHT.png");

    this.greenRedSprite = ASSET_MANAGER.getAsset("./img/green1.png");

    //Size of image.
    this.barwidth = 400;
    this.barheight = 150;
    
    //Initial state values
    this.health = 128;
    this.greenRedheight = 5;
    this.redwidth = 256;
    this.greenwidth = 256;

    //Determine horizontal positioning.
    this.x = this.fighter.isPlayer ? 70 : 900;
    this.y = 5;
    this.greenX = this.fighter.isPlayer ? this.x + 88 : this.x + 55;
    this.greenRedY = this.y + 73
    this.redX = this.fighter.isPlayer ? 70 + 88 : 900 + 55;
    
    Entity.call(this, this.game, this.x, this.y);
}

Bar.prototype = new Entity(); //Extend Entity class.
Bar.prototype.constructor = Bar;

/**
 * Empty method qualifying object to extend Entity class.
 *
 * @author Syrym Satanov
 */
Bar.prototype.update = function () { }

/**
 * Draws Bar to Canvas.
 *
 * @param   ctx <Canvas.context>    Context the Canvas draws in.
 */
Bar.prototype.draw = function (ctx) {
    ctx.drawImage(this.greenRedSprite, 0, 17, this.redwidth, this.greenRedheight, this.redX, this.greenRedY, this.redwidth, this.greenRedheight); //red bar 
    ctx.drawImage(this.greenRedSprite, 0, 0, this.greenwidth, this.greenRedheight, this.greenX, this.greenRedY, this.greenwidth, this.greenRedheight); // green bar
    ctx.drawImage(this.bar, 0, 0, this.barwidth, this.barheight, this.x, this.y, this.barwidth, this.barheight); // health bar

    Entity.prototype.draw.call(this);
}

/**
 * Manages health value.
 *
 * @param   damage  <int>   Damage done to fighter.
 */
Bar.prototype.decreaseHealth = function (damage) {
    this.health -= damage;
    this.fighter.isPlayer ? this.greenwidth -= damage : this.greenX += damage, this.greenwidth -= damage;
    if (this.greenwidth <= 0) {
        this.fighter.game.updateWinner(this.fighter);
    }
}


