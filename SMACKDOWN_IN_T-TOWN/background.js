/**
 * Static image object wrapper.
 *
 * @param   game        <GameEngine>    Reference to game engine.
 * @param   background  <String>        Path to background image.         
 * @author John Jackson
 */
function Background(game, background) {
    this.active_background = background;
    this.x = 0;
    this.y = 0;
    this.startX = 0;
    this.startY = 0;
    this.game = game;
    this.ctx = game.ctx;
}

/**
 * Draw image on canvas.
 */
Background.prototype.draw = function () {
    ////console.log(this.active_background);
    this.ctx.drawImage(this.active_background,
                  0, 0,  // source from sheet
                  1350, 600,
                  0, 0,
                  1350,
                  600);
}

/**
 * Empty method qualifying it for wrapping with Entity.
 */
Background.prototype.update = function () {
    //do nothing
}
