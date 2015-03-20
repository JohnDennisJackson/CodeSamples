/**
 * Control system for AI controlled opponents.
 *
 * @param   game    <GameEngine>    Reference to engine driving game.
 * @param   offset  <int>           Opponent specific offset for determining
 *                                  relative position.
 * @author Vlad Gudzyuk
 */
function Ai_controller(game, offset) {
    this.game = game;
    this.offset = offset;
    this.wait = 15;
    this.count = 0;
}

/**
 * Next action logic for AI controlled character.
 */
Ai_controller.prototype.action = function () {
    var ent = this.game.entities[1];
    var ent2 = this.game.entities[2];
    var offset2 = ent.offset;
    if (this.count === 0) {

    //Determine AI position relative to User controlled fighter.
    if (((ent2.x+this.offset) - (ent.x + offset2)) > 115) {
        ent2.leftwalk = true;
        ent2.rightwalk = false;
        ent2.standing = false;
        ent2.standingLeft = false;
        ent2.isRight = false;
        ent2.x += -3;
        if (((ent2.x+ this.offset) - (ent.x+offset2)) <= 115) {
            this.count = this.wait;
        }
        //Move left.
    } else if(((ent2.x + this.offset)-(ent.x - offset2))< -90){
        ent2.rightwalk = true;
        ent2.leftwalk = false;
        ent2.standing = false;
        ent2.standingLeft = false;
        ent2.isRight = true;
        ent2.x += 3;
        if (ent2.x - ent.x >= -90) {
            this.count = this.wait;
        }
        //Move right.
    } else {
        var int_attack = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

        if (int_attack === 1) {//weak punch
            ent2.rightwalk = false;
            ent2.leftwalk = false;
            ent2.standing = false;
            ent2.standingLeft = false;
            ent2.sittingRight = false;
            ent2.sittingLeft = false;
            ent2.strong_kick = false;
            ent2.strong_punch = false;
            ent2.weak_kick = false;
            ent2.weak_punch = true;
            ent2.current_action = true;
            this.count = this.wait;
        } else if (int_attack === 2) {//weak kick
            ent2.rightwalk = false;
            ent2.leftwalk = false;
            ent2.standing = false;
            ent2.standingLeft = false;
            ent2.sittingRight = false;
            ent2.sittingLeft = false;
            ent2.strong_kick = false;
            ent2.strong_punch = false;
            ent2.weak_punch = false;
            ent2.weak_kick = true;
            ent2.current_action = true;
            this.count = this.wait;
        } else if (int_attack === 3) {//strong punch
            ent2.rightwalk = false;
            ent2.leftwalk = false;
            ent2.standing = false;
            ent2.standingLeft = false;
            ent2.sittingRight = false;
            ent2.sittingLeft = false;
            ent2.strong_kick = false;
            ent2.strong_punch = true;
            ent2.current_action = true;
            this.count = this.wait;
        } else if (int_attack === 4) {//strong kick
            ent2.rightwalk = false;
            ent2.leftwalk = false;
            ent2.standing = false;
            ent2.standingLeft = false;
            ent2.sittingRight = false;
            ent2.sittingLeft = false;
            ent2.strong_kick = true;
            ent2.current_action = true;
            this.count = this.wait;
        }
    }
    } else {
        //Idle...
        this.count += -1;
        if (ent2.isRight) {
            ent2.rightwalk = false;
            ent2.leftwalk = false;
            ent2.standing = true;
            ent2.standingLeft = false;
            ent2.sittingRight = false;
            ent2.sittingLeft = false;
        } else {
            ent2.rightwalk = false;
            ent2.leftwalk = false;
            ent2.standingLeft = true;
            ent2.standing = false;
            ent2.sittingRight = false;
            ent2.sittingLeft = false;
         }
    }
}

/**
 * Randomly chooses attack.
 */
Ai_controller.prototype.attack = function () {
    var int_attack = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

    if (int_attack === 1) {//weak punch
        ent2.rightwalk = false;
        ent2.leftwalk = false;
        ent2.standing = false;
        ent2.standingLeft = false;
        ent2.sittingRight = false;
        ent2.sittingLeft = false;
        ent2.strong_kick = false;
        ent2.strong_punch = false;
        ent2.weak_kick = false;
        ent2.weak_punch = true;
        ent2.current_action = true;
    } else if (int_attack===2) {//weak kick
        ent2.rightwalk = false;
        ent2.leftwalk = false;
        ent2.standing = false;
        ent2.standingLeft = false;
        ent2.sittingRight = false;
        ent2.sittingLeft = false;
        ent2.strong_kick = false;
        ent2.strong_punch = false;
        ent2.weak_punch = false;
        ent2.weak_kick = true;
        ent2.current_action = true;
    }else if(int_attack===3) {//strong punch
        ent2.rightwalk = false;
        ent2.leftwalk = false;
        ent2.standing = false;
        ent2.standingLeft = false;
        ent2.sittingRight = false;
        ent2.sittingLeft = false;
        ent2.strong_kick = false;
        ent2.strong_punch = true;
        ent2.current_action = true;
    } else if (int_attack === 4) {//strong kick
        ent2.rightwalk = false;
        ent2.leftwalk = false;
        ent2.standing = false;
        ent2.standingLeft = false;
        ent2.sittingRight = false;
        ent2.sittingLeft = false;
        ent2.strong_kick = true;
        ent2.current_action = true;
    }
}