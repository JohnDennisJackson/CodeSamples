function Boss(game, isPlayer) {
    //Boss Sprite
    this.boss_standingAnim = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 0, 0, 360, 450, .03, 1, true, false, 0);
    this.boss_rightwalkAnim = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 65, 405,298, 450, .1, 17, true, false, 0);
    this.boss_jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 910, 1760, 360, 450, .05, 1, false, false, 0);

    this.boss_standingLeftAnim = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183-360, 0, 360, 450, .03, 1, true, true, 0);
    this.boss_leftwalkAnim = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 50, 405, 298, 450, .1, 17, true, true, 0);
    this.boss_leftjumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183-910-360, 1760, 360, 450, .05, 1, false, true, 0);

    this.boss_blockRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 360, 0, 360, 450, 1, 1, true, true, 0);
    this.boss_blockLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183 - 360*2, 0, 360, 450, 1, 1, true, true, 0);

    /////new controls animation weak punch
    this.boss_weak_punch_leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183 - 430*3, 840 + 450, 430, 450, .1, 3, false, true, 0);

    this.boss_weak_punch_rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 0, 840+450, 430, 450, .1, 3, false, false, 0);

    ////// weak kick
    this.boss_weak_kick_rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 0, 2610, 400, 450, .1, 5, false, false, 0);

    this.boss_weak_kick_leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183 - 1960, 2610, 400, 450, .1, 5, false, true, 0);

    //strong punch
    this.boss_strong_punch_rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 0, 1730, 430, 450, .1, 5, false, false, 0);

    this.boss_strong_punch_leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183 - 2150, 1730, 430, 450, .1, 5, false, true, 0);
    //strong kick
    this.boss_strong_kick_rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 0, 3090, 415, 450, .12, 3, false, false, 0);
    this.boss_strong_kick_rightAnimation_final = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 1245, 3090, 500, 450, .12, 2, false, false, 0);

    this.boss_strong_kick_leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183-1200, 3090, 415, 450, .12, 3, false, true, 0);
    this.boss_strong_kick_leftAnimation_final = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183 - 1200 - 1050, 3090, 500, 450, .12, 2, false, true, 0);


    this.boss_Right_hit_animation = new Animation(ASSET_MANAGER.getAsset("./img/boss.png"), 0, 1285, 360, 450, .2, 1, false, false, 0);

    this.boss_Left_hit_animation = new Animation(ASSET_MANAGER.getAsset("./img/boss_left.png"), 5183-360, 1285, 360, 450, .2, 1, false, true, 0);

    //Boss's turf
    this.turf = "./img/boss_background.jpg";

    //new boolean values added here
    this.weak_punch = false;
    this.weak_kick = false;
    this.strong_punch = false;
    this.strong_kick = false;
    this.current_action = false;
    this.gotHit = false;
    this.lost = false;
    this.won = false;
    this.isPlayer = isPlayer;
    this.jumping = false;
    this.sittingLeft = false;
    this.sittingRight = false;
    this.taunt = false;
    this.standing = true;
    this.rightwalk = false;

    this.standingLeft = false;
    this.leftwalk = false;
    this.isRight = isPlayer;
    this.game = game;
    //this.controlled = false;
    //Entity.call(this, game, 0, 400);
    //this.weakpunchR_hitbox = { x: this.x + 180, y: this.y -120, width: 125, height: 45 }
    this.myboxes = new Hitbox(game, 1);
    this.myboxes.setHitbox(this.x + 140, this.y - 230, 125, 300);
    this.bar;
}

//Boss.prototype = new Entity();
//Boss.prototype.constructor = Boss;

Boss.prototype.loadEnergyBar = function (energy_bar) { this.bar = energy_bar }

Boss.prototype.updateOrientation = function () {
    this.standing = this.isPlayer;
    this.standingLeft = !this.isPlayer;
    this.isRight = this.isPlayer;

    this.start = this.isPlayer ? 100 : 1000;
    this.ground =485;
    this.controlled = this.isPlayer;
    this.bar = new Bar(this.game, this);
    this.offset = 62;
    if (!this.isPlayer) {
        this.my_ai = new Ai_controller(this.game, 0);
    }
    Entity.call(this, this.game, this.start, this.ground);
}

Boss.prototype.update = function () {
    //this.myboxes.setHitbox(this.x + 70, this.y - 140, 125, 300);
    //this.weakpunchR_hitbox = { x: this.x + 180, y: this.y - 120, width: 125, height: 45 }

    //this.myboxes.setAttackBox(this.x + 180, this.y - 120, 125, 45);
    if (this.isRight) {
        this.myboxes.setHitbox(this.x + 140, this.y - 230, 125, 300);
        this.offset = 62;
    } if (!this.isRight) {
        this.myboxes.setHitbox(this.x - 10, this.y - 230, 125, 300);
        this.offset = 57;
    }

    if (this.controlled) {
        if (this.game.space) {
            this.jumping = true;
            this.strong_kick = false;
            this.strong_punch = false;
            this.weak_kick = false;
            this.weak_punch = false;
        }
        if (this.game.rightArrow && this.current_action === false) {
            this.rightwalk = true;
            this.leftwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.isRight = true;
        } else if (this.game.leftArrow && this.current_action === false) {
            this.leftwalk = true;
            this.rightwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.isRight = false;
        } else if (this.game.downArrow && this.isRight && this.current_action === false) {
            this.rightwalk = false;
            this.leftwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = true;
            this.sittingLeft = false;
            this.strong_kick = false;
        } else if (this.game.downArrow && !this.isRight && this.current_action === false) {
            this.rightwalk = false;
            this.leftwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = true;
            this.strong_kick = false;

        } else if (this.game.theAPressed && this.current_action === false) {//A weak punch
            this.rightwalk = false;
            this.leftwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = false;
            this.strong_kick = false;
            this.strong_punch = false;
            this.weak_kick = false;
            this.weak_punch = true;
            this.current_action = true;
        } else if (this.game.theSPressed && this.current_action === false) {//S weak kick
            this.rightwalk = false;
            this.leftwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = false;
            this.strong_kick = false;
            this.strong_punch = false;
            this.weak_punch = false;
            this.weak_kick = true;
            this.current_action = true;
        } else if (this.game.theDPressed && this.current_action === false) {//D Strong punch
            this.rightwalk = false;
            this.leftwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = false;
            this.strong_kick = false;
            this.strong_punch = true;
            this.current_action = true;
        } else if (this.game.theFPressed && this.current_action === false) {//F Strong kick
            this.rightwalk = false;
            this.leftwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = false;
            this.strong_kick = true;
            this.current_action = true;
        } else if (this.isRight && this.current_action === false) {//if not any previous actions then just idle to right
            this.rightwalk = false;
            this.leftwalk = false;
            this.standing = true;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = false;
        } else if (!this.isRight && this.current_action === false) {// idle to left
            this.rightwalk = false;
            this.leftwalk = false;
            this.standingLeft = true;
            this.standing = false;
            this.sittingRight = false;
            this.sittingLeft = false;
        }
    }
    if (this.bar.greenwidth <= 0) {//----------------------------------------------------------------------------------added if for win/lost here
        this.lost = true;
        this.controlled = false;
    }
    if (!this.controlled && !this.current_action) {
        this.my_ai.action();
        //this.rightwalk = false;
        //this.leftwalk = false;
        //this.standing = false;
        //this.standingLeft = false;
        //this.sittingRight = false;
        //this.sittingLeft = false;
        //this.strong_kick = false;
        //this.strong_punch = false;
        //this.weak_kick = false;
        //this.weak_punch = true;
        //this.current_action = true;
    }
    if (this.gotHit) {//<-----------------------------------------new from here
        this.current_action = true;
        this.rightwalk = false;
        this.leftwalk = false;
        this.standing = false;
        this.sittingRight = false;
        this.sittingLeft = false;
        this.weak_punch = false;
        this.weak_kick = false;
        this.strong_punch = false;
        this.strong_kick = false;
        if (this.jumping) {
            this.boss_jumpAnimation.elapsedTime = 0;
            this.jumping = false;
            this.y = this.ground;
        }
        if (this.isRight) {
            //////console.log("Hit right");
            if (this.x >= -50) {
                this.x += -1;
            }

            if (this.boss_Right_hit_animation.isDone()) {
                //////console.log("end of right hit animation");
                this.boss_Right_hit_animation.elapsedTime = 0;
                //this.standingLeft = true;
                this.standing = true;
                this.current_action = false;
                this.gotHit = false;
            }//add your animations accordingly both left and right hit animations
        } else {
            //////console.log("hit left");
            if (this.x < 1100) {
                this.x += 1;
            }

            if (this.boss_Left_hit_animation.isDone()) {
                //////console.log("end of hit animation Left");
                this.boss_Left_hit_animation.elapsedTime = 0;
                this.standingLeft = true;
                this.current_action = false;
                this.gotHit = false;

            }
        }//<-------------------------to here 

    }//end of added code
    if (this.jumping) {
        var jumpDistance;

        if (this.isRight) {
            if (this.boss_jumpAnimation.isDone()) {
                this.boss_jumpAnimation.elapsedTime = 0;
                if (this.jumping) {
                    this.game.moveSeffect.playFall();
                }
                this.jumping = false;
                this.standing = true;
                this.current_action = false;
            }
            jumpDistance = this.boss_jumpAnimation.elapsedTime / this.boss_jumpAnimation.totalTime;
        } else {
            if (this.boss_leftjumpAnimation.isDone()) {
                this.boss_leftjumpAnimation.elapsedTime = 0;
                if (this.jumping) {
                    this.game.moveSeffect.playFall();
                }
                this.jumping = false;
                this.standing = false;
                this.current_action = false;
            }
            jumpDistance = this.boss_leftjumpAnimation.elapsedTime / this.boss_jumpAnimation.totalTime;
        }

        var totalHeight = 200;
        var howHigh = -4;
        if (this.game.upArrowPressed) {
            howHigh = -6;
        }
        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (howHigh * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
        if (this.controlled && this.game.rightArrow && this.x < 1050) {
            this.x += 10;

        } else if (this.controlled && this.game.leftArrow && this.x > 20) {
            this.x -= 10;

        }
        this.leftwalk = false;
        this.rightwalk = false;
        this.standing = false;
        this.standingLeft = false;
        this.sittingRight = false;
        this.sittingLeft = false;
        this.weak_punch = false;
        this.weak_kick = false;
        this.strong_punch = false;
        this.strong_kick = false;

    }
    if (this.lost) {//------------------------------
            this.jumping = false;
            this.standing = false;
            this.current_action = false;
            this.leftwalk = false;
            this.rightwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = false;
            this.weak_punch = false;
            this.weak_kick = false;
            this.strong_punch = false;
            this.strong_kick = false;
            this.gotHit = false;
    }

    if (this.won) {
            this.jumping = false;
            this.standing = false;
            this.current_action = false;
            this.leftwalk = false;
            this.rightwalk = false;
            this.standing = false;
            this.standingLeft = false;
            this.sittingRight = false;
            this.sittingLeft = false;
            this.weak_punch = false;
            this.weak_kick = false;
            this.strong_punch = false;
            this.gotHit = false;
            this.strong_kick = false;
    }

    if (this.weak_punch) {
        if (this.isRight) {
            if (this.boss_weak_punch_rightAnimation.currentFrame() === 3) {
                this.myboxes.setAttackBox(this.x + 300, this.y - 130, 125, 45);// right weak punch hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }
            if (this.boss_weak_punch_rightAnimation.isDone()) {
                this.boss_weak_punch_rightAnimation.elapsedTime = 0;
                this.weak_punch = false;
                this.standing = true;
                this.current_action = false;
            }
        } else {
            if (this.boss_weak_punch_leftAnimation.currentFrame() === 3) {//new code from here 3 is the frame it checks for
                this.myboxes.setAttackBox(this.x-100, this.y - 130, 125, 45);// Left weak punch hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }//to here
            if (this.boss_weak_punch_leftAnimation.isDone()) {
                this.boss_weak_punch_leftAnimation.elapsedTime = 0;
                this.weak_punch = false;
                this.standing = false;
                this.current_action = false;
            }
        }
    }

    if (this.strong_punch) {
        if (this.isRight) {
            if (this.boss_strong_punch_rightAnimation.currentFrame() === 3) {
                this.myboxes.setAttackBox(this.x + 180, this.y - 150, 125, 45);// right weak punch hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }
            if (this.boss_strong_punch_rightAnimation.isDone()) {
                this.boss_strong_punch_rightAnimation.elapsedTime = 0;
                this.strong_punch = false;
                this.standing = true;
                this.current_action = false;
            }
        } else {
            if (this.boss_strong_punch_leftAnimation.currentFrame() === 3) {
                this.myboxes.setAttackBox(this.x - 22, this.y - 150, 125, 45);// right weak punch hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }
            if (this.boss_strong_punch_leftAnimation.isDone()) {
                this.boss_strong_punch_leftAnimation.elapsedTime = 0;
                this.strong_punch = false;
                this.standing = false;
                this.current_action = false;
            }
        }
    }
    if (this.weak_kick) {
        if (this.isRight) {
            if (this.boss_weak_kick_rightAnimation.currentFrame() === 3) {
                this.myboxes.setAttackBox(this.x + 165, this.y - 100, 125, 65);// right weak punch hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }
            if (this.boss_weak_kick_rightAnimation.isDone()) {
                this.boss_weak_kick_rightAnimation.elapsedTime = 0;
                this.weak_kick = false;
                this.standing = true;
                this.current_action = false;
            }
        } else {
            if (this.boss_weak_kick_leftAnimation.currentFrame() === 3) {
                this.myboxes.setAttackBox(this.x - 30, this.y-100, 115, 65);// right weak kick hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }
            if (this.boss_weak_kick_leftAnimation.isDone()) {
                this.boss_weak_kick_leftAnimation.elapsedTime = 0;
                this.weak_kick = false;
                this.standing = false;
                this.current_action = false;
            }
        }
    }
    if (this.strong_kick) {
        if (this.isRight) {
            if (this.boss_strong_kick_rightAnimation.currentFrame() === 3) {
                this.myboxes.setAttackBox(this.x + 275, this.y-200, 200, 55);// right strong kick hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }
            if (this.boss_strong_kick_rightAnimation_final.isDone()) {
                this.boss_strong_kick_rightAnimation.elapsedTime = 0;
                this.boss_strong_kick_rightAnimation_final.elapsedTime = 0;
                this.strong_kick = false;
                this.standing = true;
                this.current_action = false;
            }
        } else {
            if (this.boss_strong_kick_leftAnimation.currentFrame() === 3) {
                this.myboxes.setAttackBox(this.x - 100, this.y - 200, 125, 55);// right weak punch hitbox set****
                this.myboxes.setAttack();
                this.myboxes.attackenemy();
                this.myboxes.unsetAttack();
            }
            if (this.boss_strong_kick_leftAnimation_final.isDone()) {
                this.boss_strong_kick_leftAnimation.elapsedTime = 0;
                this.boss_strong_kick_leftAnimation_final.elapsedTime = 0;
                this.strong_kick = false;
                this.standing = false;
                this.current_action = false;
            }
        }


    }

    if (this.controlled && this.rightwalk && this.x <= 1050) {
        this.x += 10;


    } else if (this.controlled && this.leftwalk && this.x >= 50) {
        this.x -= 10;

    }
    //}//where controlled is
}

Boss.prototype.draw = function (ctx) {
    //commented this part out since is was used for setting hitboxes testing
    //ctx.fillStyle = "DarkGreen";
    //ctx.fillRect(this.myboxes.hitbox.x, this.myboxes.hitbox.y, this.myboxes.hitbox.width, this.myboxes.hitbox.height);
    //Entity.prototype.draw.call(this);
    //if (this.current_action) {
    //   ctx.fillStyle = "Red";
    //    ctx.fillRect(this.myboxes.attackbox.x, this.myboxes.attackbox.y, this.myboxes.attackbox.width, this.myboxes.attackbox.height);
    //    Entity.prototype.draw.call(this);
    //}  
    if (this.jumping) {
        if (this.isRight) {
            this.boss_jumpAnimation.drawFrame(this.game, ctx, this.x, this.y - 340);
        } else {
            this.boss_leftjumpAnimation.drawFrame(this.game, ctx, this.x - 100, this.y - 340);
        }
    } else if (this.gotHit) {//<-----------------------------------------------------------added hit animation here
        if (this.isRight) {
            this.boss_Right_hit_animation.drawFrame(this.game, ctx, this.x - 30, this.y - 300);
        } else {
            this.boss_Left_hit_animation.drawFrame(this.game, ctx, this.x - 30, this.y - 300);
        }

    } else if (this.rightwalk) {
        this.boss_rightwalkAnim.drawFrame(this.game, ctx, this.x, this.y - 300);
    } else if (this.leftwalk) {
        this.boss_leftwalkAnim.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
    } else if (this.sittingLeft) {
        this.boss_blockLeftAnimation.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
        //////console.log("block Left");
    } else if (this.sittingRight) {
        this.boss_blockRightAnimation.drawFrame(this.game, ctx, this.x, this.y - 300);
    } else if (this.weak_punch) {
        if (this.isRight) {
            this.boss_weak_punch_rightAnimation.drawFrame(this.game, ctx, this.x, this.y - 300);
        } else if (!this.isRight) {
            this.boss_weak_punch_leftAnimation.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
        }
    } else if (this.weak_kick) {
        if (this.isRight) {
            this.boss_weak_kick_rightAnimation.drawFrame(this.game, ctx, this.x, this.y - 300);
        } else if (!this.isRight) {
            this.boss_weak_kick_leftAnimation.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
            //////console.log("this.x " + this.x + " this.y " + this.y, +" ");
        }
    } else if (this.strong_punch) {
        if (this.isRight) {
            this.boss_strong_punch_rightAnimation.drawFrame(this.game, ctx, this.x, this.y - 300);
        } else if (!this.isRight) {
            this.boss_strong_punch_leftAnimation.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
        }
    } else if (this.strong_kick) {
        if (this.isRight) {
            this.boss_strong_kick_rightAnimation.drawFrame(this.game, ctx, this.x, this.y - 300);
            if (this.boss_strong_kick_rightAnimation.isDone()) {
                this.boss_strong_kick_rightAnimation_final.drawFrame(this.game, ctx, this.x, this.y - 300);
            }
        } else if (!this.isRight) {
            this.boss_strong_kick_leftAnimation.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
            if (this.boss_strong_kick_leftAnimation.isDone()) {
                this.boss_strong_kick_leftAnimation_final.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
            }
            
            //////console.log("this.x " + this.x + " this.y " + this.y, +" ");
        }
    } else if (this.standing) {
        this.boss_standingAnim.drawFrame(this.game, ctx, this.x, this.y - 300);
    } else if (this.standingLeft) {
        this.boss_standingLeftAnim.drawFrame(this.game, ctx, this.x - 100, this.y - 300);
    }
    Entity.prototype.draw.call(this);
}
