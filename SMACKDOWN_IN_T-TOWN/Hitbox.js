/**
 * Hit detection scheme for fighters.
 *
 * @param   game    <GameEngine>    Reference to game engine.
 * @param   id      <int>           ID of fighter.
 * @author  Vlad Gudzyuk
 */
function Hitbox(game, id) {
    this.game = game;
    this.ID = id;
    this.hitbox = { x: 0, y: 0, width: 0, height: 0 };
    this.attackbox = { x: 0, y: 0, width: 0, height: 0 };
    this.attack = false;
    this.attackSeffect = new SoundEffect(game);
}

/**
 * Set attack state.
 */
Hitbox.prototype.setAttack = function () {
    this.attack = true;
}

/**
 * Reset attack state.
 */
Hitbox.prototype.unsetAttack = function () {
    this.attack = false;
}

/**
 * Set boundaries for recieving damage.
 *
 * @param   x1      <int>   X position of Hitbox.   
 * @param   y1      <int>   Y position of Hitbox.
 * @param   width1  <int>   Width of Hitbox.
 * @param   Height1 <int>   Height of Hitbox.
 */
Hitbox.prototype.setHitbox = function (x1, y1, width1, height1) {
    this.hitbox = { x: x1, y: y1, width: width1, height: height1 }
}


/**
 * Set boundaries for recieving damage.
 *
 * @param   x1      <int>   X position of attack box.   
 * @param   y1      <int>   Y position of attack box.
 * @param   width1  <int>   Width of attack box.
 * @param   Height1 <int>   Height of attack box.
 */
Hitbox.prototype.setAttackBox = function (x1, y1, width1, height1) {
    ////console.log("set attack box ");
    this.attackbox = { x: x1, y: y1, width: width1, height: height1 }
}

/**
 * Detect a collision on left.
 *
 * @return  *anonymous  <boolean>   True if collision occurred.
 */
Hitbox.prototype.collideLeft = function () {
    if (hitbox.x<=0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Detect a collision on right.
 *
 * @return  *anonymous  <boolean>   True if collision occurred.
 */
Hitbox.prototype.collideRight = function () {
    if (this.hitbox.x + this.hitbox.height >=1350) {
        return true;
    } else {
        return false;
    }
}

/**
 * Detects an attack by Fighter and notify Bar.
 */
Hitbox.prototype.attackenemy = function () {
    var ent = this.game.entities[1];
    var ent2 = this.game.entities[2];
    var damage = 1;
    if (ent.myboxes.ID != this.ID) {
        //Detect an overlap of Fighter/Opponent hitboxes.
        if ((this.attack && !ent.gotHit &&
            (this.attackbox.x < ent.myboxes.hitbox.x + ent.myboxes.hitbox.width)) &&
            (this.attackbox.x + this.attackbox.width > ent.myboxes.hitbox.x) &&
            (this.attackbox.y < ent.myboxes.hitbox.y + ent.myboxes.hitbox.height) &&
            (this.attackbox.height + this.attackbox.y > ent.myboxes.hitbox.y)) {
            
            if (ent.blockLeft || ent.blockRight) {
                damage = .5;
            }
            if (ent2.weak_punch || ent2.weak_kick) {
                damage *= 8;
            } else if(ent2.slide_punch) {
                damage *= 32;
            } else {
                damage *= 16;
            }
            
            if (ent.bar.greenwidth <= 0) {
                ent.gotHit = false;
                damage = 0;
            } else {
                ent.gotHit = true;
            }
            this.attackSeffect.playSeffect();
			if(ent.gotHit && ent2.slide_punch) ent2.stopSPunch();
            ent.bar.decreaseHealth(damage);
        }
    } else if (ent2.myboxes.ID != this.ID) {
        if ((this.attack && !ent2.gotHit &&
            (this.attackbox.x < ent2.myboxes.hitbox.x + ent2.myboxes.hitbox.width)) &&
            (this.attackbox.x + this.attackbox.width > ent2.myboxes.hitbox.x) &&
            (this.attackbox.y < ent2.myboxes.hitbox.y + ent2.myboxes.hitbox.height) &&
            (this.attackbox.height + this.attackbox.y > ent2.myboxes.hitbox.y)) {

            if (ent2.blockLeft || ent2.blockRight) {
                damage = 1;
            }
            if (ent.weak_punch || ent.weak_kick) {
                damage *= 8;
            } else if (ent.slide_punch) {
                damage *= 32;
            } else {
                damage *= 16;
            }
            
            if (ent2.bar.greenwidth <= 0) {
            ent2.gotHit = false;
            damage = 0;
            } else {
                ent2.gotHit = true;
            }
            this.attackSeffect.playSeffect();
			if(ent2.gotHit && ent.slide_punch) ent.stopSPunch();
            //console.log("Player hit lost " + damage + "health");
            ent2.bar.decreaseHealth(damage);
            
        }
    }
}


/**
 * Detects an attack on Fighter notify Bar.
 *
 * @return  *anonymous  <boolean>   True if player was attacked.
 */
Hitbox.prototype.attackPlayer = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.Hitbox !== this && ent.active_backround) {
            //Detect an overlap of Player/Opponent Hitboxes.
            if (this.hitbox.x < ent.Hitbox.hitbox.x + ent.Hitbox.hitbox.width &&
                this.hitbox.x + this.hitbox.width > ent.Hitbox.hitbox.x &&
                this.hitbox.y < ent.Hitbox.hitbox.y + ent.Hitbox.hitbox.height &&
                this.hitbox.height + this.hitbox.y > ent.Hitbox.hitbox.y) {
                return true;
            } else {
                return false;
            }
        }
    }
}
