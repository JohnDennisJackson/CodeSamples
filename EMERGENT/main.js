/**
 * Shell for this code was borrowed from Dr. Christopher Marriott my
 * Computational Worlds instructor @ the UWT.
 *
 * This is part of a project attempting to model "frisbee clustering" as demonstrated @ http://www.ai-junkie.com/competition.htm.  So 
 * the basic idea is that there are a lot of frisbees and some robots.  The robots wander around and run into frisbees.  The robots have 
 * a frisbee pusher that accomodates 1 frisbee.  If while pushing a frisbee, the robot runs into another frisbee, it will back away from 
 * both frisbees and spin around and start wandering again.  Governed by those principles with some randomness thrown in, clusters of 
 * frisbees emerge.  I have tried to follow these guidelines and sprinkled a little of my own randomness around as well.
 */

//Globals
var friction = 1;
var maxSpeed = 400;
var gameEngine = new GameEngine();
var canvas;
var ctx;
var bots = [];
var frisbees = [];
var ASSET_MANAGER = new AssetManager();

/**
 * Preloads necessary assets for simulation.
 * 
 * @author John Jackson
 */
ASSET_MANAGER.downloadAll(function () {
    console.log("Initializing...");
    canvas = document.getElementById('simBoard');
    ctx = canvas.getContext('2d');

    //Make robot...
    for (var i = 0; i < 2; i++) {
        circle = new Circle(gameEngine, false);
        bots.push(circle);
        gameEngine.addEntity(circle);
    }
    
    //Make frisbees...
    for (var i = 0; i < 30; i++) {
        circle = new Circle(gameEngine, true);
        frisbees.push(circle);
        gameEngine.addEntity(circle);
    }

    gameEngine.init(ctx);
    gameEngine.start();
});

//Server address.
var socket = io.connect("XXX.XXX.XXX.XXX:XXXX");

//Actionable items.
var saveButton = document.getElementById("save");
var loadButton = document.getElementById("load");

//User identifiers.
var name = 'John Jackson';
var stateName = 'Emergent';

/**
 * Initializes server connection.
 *
 * @author John Jackson
 */
window.onload = function () {
    console.log("starting up da sheild");
    var messages = [];
    

    /**
     * Signals a connection to console.
     */
    socket.on("connect", function () {
        console.log("Socket connected.")
    });

    /** 
     * Signals a disconnect to console.
     */
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });

    /**
     * Signals reconnection to console.
     */
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

    /**
     * Receives 'load' message from server, loads the transmitted state data 
     * into the simulation.
     * 
     * @/// <param name="data" type="JSON">State data for simulation.</param>
     * @author John Jackson
     */
    socket.on('load', function (data) {
        //Confirm simulation is not engaged, in case of cold load.
        gameEngine.done = true;

        if (data) {
            messages.push(data);
        } else {
            console.log("There is a problem:", data);
        }

        var ent_ind = 0; //Index in gameEngine.entities
        var the_bots = messages[0]['bots']; //State data for bots
        var the_frisbees = messages[0]['frisbees']; //State data for frisbees
        //var caught_frisbees = []; //
        var caught_frisb_ind = 0;

        //Empty state containers.
        bots = [];
        frisbees = [];


        var i;
        //Load bots data...
        for (i = 0; i < the_bots.length; i++) {
            var circ = new Circle(gameEngine, false);
            j = 0;
            circ.x = the_bots[i][j++];
            circ.y = the_bots[i][j++];
            circ.hasFrisbee = the_bots[i][j++];
            circ.velocity = the_bots[i][j++];

            //Handle case of bot being in possession of a frisbee.
            if (circ.hasFrisbee === true) {
                var fris = new Circle(gameEngine, true);
                //caught_frisbees.push( fris );   
                fris.sync(circ);
                frisbees.push(fris);
                circ.frisbee = fris;
                //Add the frisbee to Entity list in gameEngine.
                gameEngine.entities[the_bots.length + caught_frisb_ind] = fris;
                caught_frisb_ind++;
            }

            //Add robot to Entity list in gameEngine.
            gameEngine.entities[ent_ind] = circ;
            bots.push(circ);
            ent_ind++;
        }

        //Update index being addressed in Entity list.
    ent_ind = bots.length + caught_frisb_ind;

        //Load frisbees data...
        for (i = 0; i < the_frisbees.length; i++) {
            var circ = new Circle(gameEngine, true);
            j = 0;
            circ.x = the_frisbees[i][j++];
            circ.y = the_frisbees[i][j++];
            circ.isCaught = the_frisbees[i][j++];

            //Handle case of frisbees loaded when held by bot.
            if (circ.isCaught === false) {
                gameEngine.entities[ent_ind] = circ;
                frisbees.push(circ);
                ent_ind++;
            }
        }

        //Disengage simulation.
        gameEngine.done = false;

        //Clear messages.
        messages = [];
    });

    /**
     * Uploads simulation data to server.
     *
     * @author John Jackson
     */
    saveButton.onclick = function () {
        console.log("Save Event...");

        var i = 0;

        //Get state values of bots.
        for (; i < bots.length; i++) {
            var vitals = [];
            vitals.push(bots[i].x, bots[i].y, bots[i].hasFrisbee, bots[i].velocity);
            bots[i] = vitals;
        }

        i = 0;

        //Get state values of frisbees.
        for (; i < frisbees.length; i++) {
            var vitals = [];
            vitals.push(frisbees[i].x, frisbees[i].y, frisbees[i].isCaught);
            frisbees[i] = vitals;
        }

        //Upload data to server.
        socket.emit('save', { 'studentname' : name, 'statename' : stateName, 'bots' : bots, 'frisbees' : frisbees } );
        //Re-engage simulation.
        gameEngine.done = true;
    }

    /**
     * Requests a load from the server.
     *
     * @author John Jackson
     */
    loadButton.onclick = function () {
        console.log("Requesting load...");
        socket.emit('load', { 'studentname': name, 'statename': stateName });
        console.log("load requested.");
    }
};
