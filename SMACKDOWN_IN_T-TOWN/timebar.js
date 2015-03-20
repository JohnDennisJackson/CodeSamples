/**
 * In game timer display object.
 * 
 * @param   game    <GameEngine>    Reference to game enging.
 * @author Syrym Satanov
 */
function TimeBar(game) {
    this.game = game;
	this.numbersprite = ASSET_MANAGER.getAsset("./img/numbers.png");
	this.isTimeBarOn = true;
	this.date = new Date();
	this.seconds;
	this.lastTime = this.date.getSeconds();
	this.x = 1350/2 - 52;
	this.y = 50;
	
	this.timesec = 90;
	this.s1 = 468;
	this.s2 = 520;
	
	this.width = 800;
	this.y = 50;
	Entity.call(this, this.game, this.x, this.y);
}

TimeBar.prototype = new Entity();
TimeBar.prototype.constructor = TimeBar;

/**
 * Begins TimeBar countdown.
 */
TimeBar.prototype.start = function(){
	this.isTimeBarOn = true;
}

/**
 * Pauses countdown.
 */
TimeBar.prototype.pause = function(){
	this.isTimeBarOn = false;
}

/**
 * Reset countdown.
 */
TimeBar.prototype.reset = function(){
	this.isTimeBarOn = false;
	this.timesec = 90;
	this.s1 = 468;
	this.s2 = 520;
}

/**
 * Returns seconds passed.
 *
 * @return *anonymous   <int>   Seconds passed.
 */
TimeBar.prototype.getTimeSec = function(){
	return this.timesec;
}

/**
 * Updates TimeBar state.
 *
 */
TimeBar.prototype.update = function () { 
	this.date = new Date();
	this.seconds = this.date.getSeconds();
	
    //Progress image if 1 second has passed.
	if(this.isTimeBarOn && (this.seconds - this.lastTime) === 1){
		this.s1 = 52 * Math.floor((this.timesec / 10));
		this.s2 = 52 * (this.timesec % 10);		
		if(this.timesec > 1){
			this.timesec = this.timesec - 1;
		} else {
			this.timesec = 0;
		}
	}

    //Update time reference.
	this.lastTime = this.seconds;

    //If time has expired, notify game.
	if (this.timesec <= 0 && this.s1 === 0 && this.s2 === 0) {
	    this.game.timeOutWinner();
	}
}

/**
 * Draws time image on screen.
 *
 * @param   ctx <Canvas.context>    Context the canvas draws in.
 */
TimeBar.prototype.draw = function (ctx) {
	if(this.isTimeBarOn){
		ctx.drawImage(this.numbersprite, this.s1, 0, 52, 100, this.x, this.y, 52, 100);
		ctx.drawImage(this.numbersprite,  this.s2, 0, 52, 100, this.x+52, this.y, 52, 100);
	}
    Entity.prototype.draw.call(this);
}

