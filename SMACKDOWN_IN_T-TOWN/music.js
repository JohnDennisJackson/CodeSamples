
/**
 * Wrapper for in-game music.
 *
 * @author  Syrym Satanov
 */
function Music(game, filepath, loop, volume) {
	this.music = new Audio(filepath);
	this.music.volume = volume;
	this.music.loop = loop;
	this.unit = 0.008;
}

/**
 * Plays a sound file.
 */
Music.prototype.play = function(){
	this.music.play();
}

/**
 * Pauses a sound file.
 */
Music.prototype.pause = function(){
	this.music.pause();
}
