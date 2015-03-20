/**
 * Wrapper for sprite animations.
 *  
 * @param   spriteSheet     <Image>     Image asset contain sprites.
 * @param   startX          <int>       X position of frame on spriteSheet.
 * @param   startY          <int>       Y position of frame on spriteSheet.
 * @param   frameWidth      <int>       Width of frame.
 * @param   frameHeight     <int>       Height of frame.
 * @param   frameDuration   <double>    Duration frame is displayed.
 * @param   frames          <int>       Number of frames.
 * @param   duration        <double>    Length of frame.
 * @param   loop            <boolean>   Loop animation.
 * @param   reverse         <boolean>   Reverse animation.
 * @param   animation       <int>       Animation ID.
 * @author PROVIDED
 */
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, animation) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.animation = animation;
}

/**
 * Draws a frame from animation on canvas.
 *
 * @param   game        <GameEngine>        Reference to game engine.
 * @param   ctx         <Canvas.context>    Context the Canvas is drawing in.
 * @param   x           <int>               X-Position of frame within spriteSheet.
 * @param   y           <int>               Y-Position of frame within spriteSheet.
 * @param   scaleBy     <int>               Ratio to increase/decrease the scale of drawn image.
 * @author PROVIDED
 */
Animation.prototype.drawFrame = function (game, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;

    //Track duration of animation thus far.
    this.elapsedTime += game.clockTick;

    //If animation should loop...
    if (this.loop) {
        //Reset animation if a pass is completed.
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }

    //Calculate x-index to begin clipping in case animation should be reversed.
    var xindex = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var yindex = 0;

    //If animation should reverse...
    if (this.reverse) {
        //Draw prior frame.
        if (xindex < 0) {
            xindex = this.frames - 1;
        }
    } else {
        //Draw current frame.
        if ((xindex + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
            xindex -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
            yindex++;
        }
        //Progress index to next frame.
        while ((xindex + 1) * this.frameWidth > this.spriteSheet.width) {
            xindex -= Math.floor(this.spriteSheet.width / this.frameWidth);
            yindex++;
        }
    }
   

    var locX = x;
    var locY = y;
    
    var offset = yindex === 0 ? this.startX : 0;

    //Draw the image.
    ctx.drawImage(this.spriteSheet,
                  xindex * this.frameWidth + offset, yindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

/**
 * Returns current frame of animation.
 *
 * @return *anonymous   <int>   Frame number within animation. 
 */
Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

/**
 * Returns state of animation.
 *
 * @return  *anonymous  <boolean>   Whether or not animation is finished.
 */
Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}
