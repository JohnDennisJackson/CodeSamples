/**
 * Shell for this code was borrowed from Dr. Christopher Marriott my
 * Computational Worlds instructor @ the UWT.
 */

/**
 * Gets window in browser.
 * 
 * @author PROVIDED
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

/**
 * Timer for managing game progress.
 * 
 * @author PROVIDED
 */
function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

/**
 * Progress game clock. 
 *
 * @author PROVIDED
 */
Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

/**
 * Manages game progress, state and input designation. 
 * 
 * @author PROVIDED
 */
function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.done = false;
}

/**
 * Initialize internal values.
 * 
 * @/// <param name="ctx" type="Canvas.context">Context the Canvas is drawing in.</param>
 * @author PROVIDED
 */
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
}

/**
 * Initializes game loop.
 *
 * @author PROVIDED
 */
GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

/**
 * Adds entity to internal list.
 *
 * @/// <param name="entity" type="Object">An object containing a draw and update method.</param>
 * @author PROVIDED
 */
GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

/**
 * Calls draw on Entities.
 * 
 * @author PROVIDED
 */
GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

/**
 * Updates Entities.
 *
 * @author PROVIDED
 */
GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

/**
 * Clears internal entities list.
 *
 * @author John Jackson
 */
GameEngine.prototype.clearEntities = function () {
    for (circle in this.entities) {
        circle.removeFromWorld = true;
    }
}

/**
 * Loop to progress game state.
 *
 * @author PROVIDED
 * @author John Jackson
 */
GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    if (!this.done) {
        this.update();
        this.draw();
    } 
}

/**
 * Wrapper for objects that exist in the game space.
 * 
 * @param game  <GameEngine>    Reference to managing game engine
 * @param x     <int>           Entity's x position
 * @param y     <int>           Entity's y position
 */
function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

/**
 * Wrapper for objects that exist in the game space.
 * 
 * @param game  <GameEngine>    Reference to managing game engine
 * @param x     <int>           Entity's x position
 * @param y     <int>           Entity's y position
 */
function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

/**
 * Supports call to update from game loop.  Override in extending class.
 */
Entity.prototype.update = function () {

}

/**
 * Supports call to draw from game loop.  Override in extending class.
 *
 * @param ctx   <Canvas.context>    Context the Canvas is drawing in.
 */
Entity.prototype.draw = function (ctx) {
}

