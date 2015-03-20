/**
 * Wrapper for in-game sound effects.
 * 
 * @param   game    <GameEngine>    Reference to the game engine.
 * @author  Syrym Satanov
 */
function SoundEffect(game) {
    this.game = game;

    //Action sounds.
    this.punchWSound = new Audio("./sounds/Flash_Point_-_Hit_03.wav");
    this.punchSSound = new Audio("./sounds/Flash_Point_-_Hit_05.wav");
    this.kickWSound = new Audio("./sounds/Flash_Point_-_Hit_04.wav");
    this.kickSSound = new Audio("./sounds/Flash_Point_-_Hit_05.wav");
    this.blockSound = new Audio("./sounds/block_L_05.wav");
    this.fallSound = new Audio("./sounds/fall1.wav");
    this.fistSwingSound = new Audio("./sounds/fist_swing_07.wav");
    this.footSwingSound = new Audio("./sounds/foot_swing_06.wav");

    //State sounds.
    this.finishhim = new Audio("./sounds/finishhim.mp3");
    this.bossAnounce = new Audio("./sounds/SUPRISE MOTHERFUCKER ! (1).mp3");

    //Set volume of effects.
    this.punchWSound.volume = 0.2;
    this.punchSSound.volume = 0.2;
    this.kickWSound.volume = 0.2;
    this.kickSSound.volume = 0.2;
    this.blockSound.volume = 0.2;
    this.finishhim.volume = 0.9;
    this.fallSound.volume = 0.02;
    this.fistSwingSound.volume = 0.1;
    this.footSwingSound.volume = 0.1;
    this.bossAnounce.volume = 0.9;
    this.unit = 0.008;
}

/**
 * Plays Boss announcement.
 */
SoundEffect.prototype.playBossAnnouncement = function () {
    this.bossAnounce.play();
}

/**
 * Determine appropriate effect based on player states.
 */
SoundEffect.prototype.playSeffect = function () {
    var ent = this.game.entities[1];
    var ent2 = this.game.entities[2];
    if (ent.bar.greenwidth < 10 || ent2.bar.greenwidth < 10) {
        this.finishhim.play();
    }

    if (ent.gotHit || ent2.gotHit) {
        if (ent.weak_punch || ent2.weak_punch) {// w p
            this.punchWSound.play();
        } else if (ent.strong_punch || ent2.strong_punch) { //s p
            this.punchSSound.play();
        } else if (ent.strong_kick || ent2.strong_kick || ent2.slide_punch || ent.slide_punch) { //s k 
            this.kickSSound.play();
        } else if (ent.weak_kick || ent2.weak_kick) { //w k 
            this.kickWSound.play();
        }
    } else {
        if (ent.weak_punch || ent2.weak_punch || ent.strong_punch || ent2.strong_punch) {
            this.fistSwingSound.play();
        } else if (ent.strong_kick || ent2.strong_kick || ent.weak_kick || ent2.weak_kick) {
            this.footSwingSound.play();
        }
    }
}

/**
 * Play effect.
 */
SoundEffect.prototype.play = function () {
    this.sound.play();
}

/**
 * Pauses effect.
 */
SoundEffect.prototype.pause = function () {
    this.sound.pause();
}

/**
 * Play weak punch effect.
 */
SoundEffect.prototype.playPunchW = function () {
    this.punchWSound.play();
}

/**
 * Play strong punch effect.
 */
SoundEffect.prototype.playPunchS = function () {
    this.punchSSound.play();
}

/**
 * Play weak kick effect.
 */
SoundEffect.prototype.playKickW = function () {
    this.kickWSound.play();
}

/**
 * Play strong kick effect.
 */
SoundEffect.prototype.playKickS = function () {
    this.kickSSound.play();
}

/**
 * Play block effect.
 */
SoundEffect.prototype.playBlock = function () {
    this.blockSound.play();
}

/**
 * Play fall effect.
 */
SoundEffect.prototype.playFall = function () {
    this.fallSound.play();
}
