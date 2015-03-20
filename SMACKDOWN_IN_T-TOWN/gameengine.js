// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

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
 * @author John Jackson
 * @author Syrym Satanov
 * @author Vlad Gudzyuk
 * @author PROVIDED
 */
function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    
    //Actions
    this.rightArrow = false;
    this.leftArrow = false;
    this.downArrow = false;
    this.upArrowPressed = false;
    this.theTPressed = false;
    this.theAPressed = false;
    this.theSPressed = false;
    this.theDPresed = false;
    this.theFPressed = false;
    this.thePPressed = false;
    this.rightPressed = false;
    this.leftPressed = false;
    this.shift = false;

    //Game States
    this.inStartup = true;
    this.inMenu = false;
    this.inFight = false;
    this.fightOver = false;
    this.gameOver = false;
    this.paused = false;
    this.pauseCycles = 120;
    
    //Fighter related
    this._BOSS_INDEX = 4;
    this._NUM_FIGHTERS = 5;
    this.fightersUsed = [];

    //Music
    this.startMusic = new Music(this, "./sounds/rjones1.mp3", true, .08);
    this.fight = new Music(this, "./sounds/fight.mp3", false, 1);
    this.lost = new Music(this, "./sounds/lost.mp3", false, 1);
    this.moveSeffect = new SoundEffect(this);
    this.charSelectMusic = new Music(this, "./sounds/taintedmanson.wav", true, .6);
	this.musicarray = [
	new Music(this, "./sounds/blackholesupermassive-----1_4.wav", true, .2), 
	new Music(this, "./sounds/supremasymuse-----3.wav", true, .08),
	new Music(this, "./sounds/musehysteria------2.wav", true, .3),
	new Music(this, "./sounds/blackholesupermassive-----1_4.wav", true, .2)];
}

/**
 * Initializes game's music.
 *
 * @author Syrym Satanov
 */
GameEngine.prototype.initMusics = function () {
	this.musicarray.splice(0,4);
	this.musicarray = [
	new Music(this, "./sounds/blackholesupermassive-----1_4.wav", true, .2), 
	new Music(this, "./sounds/supremasymuse-----3.wav", true, .08),
	new Music(this, "./sounds/musehysteria------2.wav", true, .3),
	new Music(this, "./sounds/blackholesupermassive-----1_4.wav", true, .2)];
}

/**
 * Initializes GameEngine
 *
 * @param ctx <Canvas.context> Context Canvas is drawing in.
 * @author PROVIDED
 */
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    this.timebar = new TimeBar(ctx);
    //////console.log('game initialized');
}

/**
 * Starts game loop.
 *
 * @author John Jackson
 * @author Syrym Satanov
 * @author Alex Prokopchik
 * @author PROVIDED
 */
GameEngine.prototype.start = function () {
    //////console.log("starting game");
    var that = this;
    (function gameLoop() {
        if (that.inStartup) {
            that.startMusic.play();	
            that.displayStartup();
        }else if (that.inMenu) {
            that.startMusic.pause();
			that.musicarray[0].pause();
			that.initMusics();
            that.charSelectMusic.play();
            that.getSelections();
        } else if (that.inFight) {
            that.charSelectMusic.pause();
            ////////console.log("In gameLoop inFight");
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
            that.musicarray[0].play();

        } else if(that.gameOver){//------------------------------
            that.displayMessage();
        }//-------------------------------------
    })();
}

/**
 * Win/loss message.
 * 
 * @param game      <GameEngine>    Reference to game engine.  
 * @param message   <String>        Message to display.
 * @author John Jackson
 */
function Message(game, message) {
    this.my_message = message;
    this.game = game;
    this.ctx = game.ctx;
}

/**
 * Draws message object.
 *
 * @author John Jackson
 */
Message.prototype.draw = function () {
    this.ctx.fillStyle = '#df1212';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 3;

    this.ctx.font = 'italic bold 60px sans-serif';
    this.ctx.fillText(this.my_message, 575, 275);
    this.ctx.strokeText(this.my_message, 575, 275);

    this.ctx.fill();
    this.ctx.stroke();
}

/**
 * Loss marker object.
 *
 * @param game          <GameEngine>    Reference to game engine.
 * @param background    <Image>         Image to display.
 * @param x             <int>           X Position on screen.
 * @param y             <int>           Y Position on screen.
 * @author Alex Prokopchik
 */
function X(game, background, x, y) {
    this.active_background = background;
    this.startX = x;
    this.startY = y;
    this.game = game;
    this.ctx = game.ctx;
}

/**
 * Draws loss marker image.
 *
 * @author Alex Prokopchik
 */
X.prototype.draw = function () {
        this.ctx.drawImage(this.active_background,
                      0, 0,  // source from sheet
                      25, 25,
                      this.startX, this.startY,
                      25,
                      25);
}

/**
 * Empty method, that's existence allows it to be used as an Entity.
 *
 * @author Alex Prokopchik
 */
X.prototype.update = function () {
   //do nothing
}

/**
 * Displays game intro screen.
 * 
 * @author John Jackson
 */
GameEngine.prototype.displayStartup = function () {
    var that = this;

    this.ctx.canvas.addEventListener("click", function (e) {
        if (that.inStartup) {
            that.inMenu = true;
            that.inStartup = false;
            //////console.log('State changed.');
            that.start();
        } else { return; }
    })

    this.ctx.drawImage(ASSET_MANAGER.getAsset("./img/startup.png"), 0,0);
};

/**
 * Clears entities list.
 *
 * @author John Jackson
 */
GameEngine.prototype.clearEntities = function () {
    var clear_ind = 0;
    while (clear_ind < this.entities.length) {
        this.entities[clear_ind].removeFromWorld = true;
        clear_ind++;
    }
};

/**
 * Updates fighter/opponent wins.
 *
 * @param character     <Fighter>   ID of fighter
 * @author John Jackson
 */
GameEngine.prototype.updateWinner = function (character) {
    //A fighters win status has three states:  0:true, 1:false, 2:undetermined.
    if (character.isPlayer) {
        this.opponentWins++;
        this.paused = true;
        this.loser = true;
        this.lost.play();     
     } else {
        this.playerWins++;
        this.paused = true;
        this.winner = true;
     }
}

/**
 * Interprets fight state.
 *
 * @author John Jackson
 */
GameEngine.prototype.updateFight = function () {
    if (!this.paused) {
        if (this.playerWins > 1) {
            if (this.fightersUsed.length === this._NUM_FIGHTERS) {
                //Reset
                this.musicarray[0].pause();
				this.initMusics();
                this.fightersUsed = [];
                this.inFight = false;
                this.inMenu = true;
                this.setUpFight();
            } else if (this.fightersUsed.length === this._NUM_FIGHTERS - 1) {
                //Load Boss
                this.loadBoss();
                this.musicarray[0].pause();
				this.musicarray.splice(0, 1);
            } else {
                //Get next opponent
                this.loadNextFight();
                this.musicarray[0].pause();
				this.musicarray.splice(0, 1);
            }
        } else if (this.opponentWins > 1) {
            //Return to Character Select Screen
            this.fightersUsed = [];
            this.inFight = false;
            this.inMenu = true;
            this.setUpFight();
        } else {
            //Repeat the same fight.
            this.resetFighters(this.fightersUsed[0], this.fightersUsed[this.fightersUsed.length - 1]);
        }
    }
};


/**
 * Loads components for final fight.
 *
 * @author John Jackson
 */
GameEngine.prototype.loadBoss = function () {
    this.bossSound = new SoundEffect(this);
    this.bossSound.playBossAnnouncement();

    this.Opponent = this.getCharacter(this._BOSS_INDEX, false);
    this.Opponent.loadEnergyBar(new Bar(this, this.Opponent));
    this.fightersUsed.push(this._BOSS_INDEX);

    this.Fighter = this.getCharacter(this.fightersUsed[0], true);
    this.Fighter.loadEnergyBar(new Bar(this, this.Fighter));

    this.setUpFight();
    this.loadFighters();
};

/**
 * Estabblishes participants of next fight.
 *
 * @author John Jackson
 */
GameEngine.prototype.loadNextFight = function () {
    var opponentIndex = 0;

    while (this.fightersUsed.indexOf(opponentIndex) > -1) { opponentIndex = Math.floor(Math.random() * ( this._NUM_FIGHTERS - 1 )) };

    this.Opponent = this.getCharacter(opponentIndex, false);
    this.Opponent.loadEnergyBar(new Bar(this, this.Opponent));
    this.fightersUsed.push(opponentIndex);

    this.Fighter = this.getCharacter(this.fightersUsed[0], true);
    this.Fighter.loadEnergyBar(new Bar(this, this.Fighter));

    this.setUpFight();
    this.loadFighters();
    //////console.log("Done Loading Next Fight");
};

/**
 * Resets fighters returning for next round.
 *
 * @param id        <int>       ID of fighter.
 * @param isPlayer  <boolean>   Is character player controlled. 
 * @author John Jackson
 */
GameEngine.prototype.getCharacter = function (id, isPlayer) {
    var fighter = null;

    switch (id) {
        case 0:
            fighter = new John(this, isPlayer);
            break;
        case 1:
            fighter = new Alex(this, isPlayer);
            break;
        case 2:
            fighter = new Vlad(this, isPlayer);
            break;
        case 3:
            fighter = new Syrym(this, isPlayer);
            break;
        case 4:
            fighter = new Boss(this, isPlayer);
    }

    fighter.updateOrientation();

    return fighter;
}

/**
 * Loads fighters and their accompanying components.
 *
 * @author John Jackson
 */
GameEngine.prototype.loadFighters = function () {
    //Add Components of fight.
    this.clearEntities();
    this.addEntity(new Background(this, ASSET_MANAGER.getAsset(this.Opponent.turf)));
    this.addEntity(this.Fighter);
    this.addEntity(this.Opponent);
    this.addEntity(this.Fighter.bar);
    this.addEntity(this.Opponent.bar);
    this.addEntity(new TimeBar(this));
};

/**
 * Called to alert there was a winner by time exceeded.
 * 
 * @author John Jackson
 */
GameEngine.prototype.timeOutWinner = function () {
    this.updateWinner(this.Fighter.bar.greenwidth > this.Opponent.bar.greenwidth ? this.Opponent : this.Fighter);
}

/**
 * Sets win counts.
 * 
 * @author John Jackson
 */
GameEngine.prototype.setUpFight = function () {
    this.playerWins = 0;
    this.opponentWins = 0;
};

/**
 * Resets fighters returning for next round.
 *
 * @param selection     <int>   ID of fighter
 * @param opponentIndex <int>   ID of opponent 
 * @author John Jackson
 */
GameEngine.prototype.resetFighters = function (selection, opponentIndex) {
    this.Fighter = this.getCharacter(selection, true);
    this.Fighter.loadEnergyBar(new Bar(this, this.Fighter));
    this.Opponent = this.getCharacter(opponentIndex, false);
    this.Opponent.loadEnergyBar(new Bar(this, this.Opponent));

    this.fight.play();
    this.loadFighters();
};

/**
 * Sets fighters for new bout.
 *
 * @param selection     <int>   ID of fighter
 * @author John Jackson
 */
GameEngine.prototype.setFighters = function (selection) {
    this.Fighter = this.getCharacter(selection, true);
    this.Fighter.loadEnergyBar(new Bar(this, this.Fighter));
    this.fightersUsed.push(selection);

    var opponentIndex = selection;

    //Find a random opponent who has not already been used.
    while (this.fightersUsed.indexOf(opponentIndex) > -1) {
        opponentIndex = Math.floor(Math.random() * (this._NUM_FIGHTERS - 1) );;
    }

    this.Opponent = this.getCharacter(opponentIndex, false);
    this.Opponent.loadEnergyBar(new Bar(this, this.Opponent));
    this.fightersUsed.push(opponentIndex);

    this.setUpFight();
    this.loadFighters();
    this.inMenu = false;
    this.inFight = true;
    
    this.start();
};

/**
 * Gets user fighter selection.
 *
 * @author John Jackson
 */
GameEngine.prototype.getSelections = function () {
    var that = this;
    
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
    this.ctx.drawImage(ASSET_MANAGER.getAsset("./img/char_select.png"), 0, 0);
    (function listenForSelection() {
        //////console.log("listening for selection");
        if (that.inStartup) {
            that.loop();
            //////console.log("in listening, called loop");
            requestAnimFrame(listenForSelection, that.ctx.canvas);
        } else {
            return;
        }

    })();


};

/**
 * Defines event listeners for acceptable user input.
 *
 * @author John Jackson
 * @author Alex Prokopchik
 * @author Vlad Gudzyuk
 * @author PROVIDED
 */
GameEngine.prototype.startInput = function () {
    //////console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (e.which === 32) {
            that.space = true;
        } else if (e.which === 39) {
            that.rightArrow = true;
        } else if (e.which === 37) {
            that.leftArrow = true;
        } else if (e.which === 65) {//A KEY
            that.theAPressed = true;
        } else if (e.which === 83) {//S key
            that.theSPressed = true;
        } else if (e.which === 84) {//T key
            that.theTPressed = true;
        } else if (e.which === 68) {// D key
            that.theDPressed = true;
        } else if (e.which === 70) {// F key
            that.theFPressed = true;
        } else if (e.which === 80) { // P key
            that.thePPressed = true;
        } else if (e.which === 38) {
            that.upArrowPressed = true;
        } else if (e.which === 40) {
            that.downArrow = true;
        } else if (e.which === 16) { // shift
            that.shift = true;
        }
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        if (e.which === 39) {
            that.rightPressed = true;
        } else if (e.which === 37) {
            that.leftPressed = true;
        } else if (e.which === 65) {//A KEY
            that.theAPressed = true;
        } else if (e.which === 83) {//S key
            that.theSPressed = true;
        } else if (e.which === 84) {//T key
            that.theTPressed = true;
        } else if (e.which === 68) {// D key
            that.theDPressed = true;
        } else if (e.which === 70) {//F key
            that.theFPressed = true;
        } else if (e.which === 80) { // P key
            //that.thePPressed = true;
        } else if (e.which === 38) {
            that.upArrowPressed = true;
        } else if (e.which === 40) {
            that.downArrow = true;
        } else if (e.which === 16) { // shift
            that.shift = true;
        }
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (e.which === 39) {
            that.rightArrow = false;
        } else if (e.which === 37) {
            that.leftArrow = false;
        } else if (e.which === 32) {
            that.space = false;
        } else if (e.which === 65) {//A KEY
            that.theAPressed = false;
        } else if (e.which === 83) {//S key
            that.theSPressed = false;
        } else if (e.which === 84) {//T key
            that.theTPressed = false;
        } else if (e.which === 68) {// D key
            that.theDPressed = false;
        } else if (e.which === 70) {//F KEY
            that.theFPressed = false;
        } else if (e.which === 80) { // P key
            that.thePPressed = false;
        } else if (e.which === 38) {
            that.upArrowPressed = false;
        } else if (e.which === 40) {
            that.downArrow = false;
        } else if (e.which === 16) { // shift
            that.shift = false;
        }
    }, false);
    
    this.ctx.canvas.addEventListener("click", function (e) {
        if (that.inMenu) {
            that.setFighters(Math.floor(e.clientX / 337.5));
        } else if (that.inMessage) {
            that.inStartup = false;
            that.inMessage = false;
            that.inMenu = true;
            that.start();
        }
    });
}

/**
 * Adds a game entity to internal list.
 *
 * @param entity    <Entity>    Entity to be added.
 * @author  PROVIDED
 */
GameEngine.prototype.addEntity = function (entity) {
    this.entities.push(entity);
}

/**
 * Calls for entities, messages and transitional images to be drawn on canvas. 
 *
 * @author  John Jackson
 * @author  Syrym Satanov
 * @author  PROVIDED    
 */
GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
     if (this.opponentWins >=1) {
        this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"),202, 108));
        if (this.opponentWins === 2) {
            this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"), 227, 108));
        }
    } else if (this.playerWins >= 1) {
        this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"), 1350 - 202, 108));
        if (this.playerWins === 2) {
            this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"), 1350-227, 108));
        }
        
    }
    if (this.playerWins >= 1 && this.opponentWins >= 1) {
        this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"), 1350 - 202, 108));
        this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"), 202, 108));
        if (this.playerWins === 2) {
            this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"), 1350 - 227, 108));
        } else if (this.opponentWins === 2) {
            this.addEntity(new X(this, ASSET_MANAGER.getAsset("./img/x.png"), 227, 108));
        }
    }
    if (this.paused) {
        if (this.pauseCycles > 0) {
            this.pauseCycles--;
            if (this.loser === true) {
                this.ctx.drawImage(ASSET_MANAGER.getAsset("./img/youlose.png"),
                           0, 0,  // source from sheet
                           700, 300,
                           325, 50,
                           700, 200);
                if (this.opponentWins === 1 && this.playerWins === 0) {
                    this.addEntity(new Message(this, "Round 1"));
                } else if (this.playerWins === 1 && this.opponentWins === 1 || this.playerWins === 0 && this.opponentWins === 2) {
                    this.addEntity(new Message(this, "Round 2"));
                } else if (this.opponentWins === 2 && this.playerWins === 1) {
                    this.addEntity(new Message(this, "Round 3"));
                }
                this.Fighter.lost = true;
                this.Opponent.win = true;
            } else if (this.winner === true) {
                this.ctx.drawImage(ASSET_MANAGER.getAsset("./img/youwin.png"),
                       0, 0,  // source from sheet
                       700, 300,
                       325, 50,
                       700, 200);
               if (this.playerWins === 1 && this.opponentWins === 0) {
                    this.addEntity(new Message(this, "Round 1"));
                } else if (this.playerWins === 1 && this.opponentWins === 1 || this.playerWins === 2 && this.opponentWins === 0) {
                    this.addEntity(new Message(this, "Round 2"));
                } else if (this.playerWins === 2 && this.opponentWins === 1) {
                    this.addEntity(new Message(this, "Round 3"));
                }
                this.Fighter.won = true;
                this.Opponent.lost = true;
            }
        } else {
            this.pauseCycles = 120;
            this.paused = false;
            this.winner = false;
            this.loser = false;
            this.updateFight();
        }  
    }

    this.ctx.restore();
}

/**
 * Updates status of game entities.
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
 * Loop to drive state progress of game.
 *
 * @author PROVIDED
 * @author John Jackson
 */
GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    if (!this.paused) {
        this.update();
    }
    this.draw();
    
    this.space = null;
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
 *
 * @author PROVIDED
 */
Entity.prototype.update = function () {
    //Override in extending class.
}


/**
 * Supports call to draw from game loop.  Override in extending class.
 *
 * @param ctx   <Canvas.context>    Context the Canvas is drawing in.
 * @author PROVIDED
 */
Entity.prototype.draw = function (ctx) {
    //Override in extending class.
}