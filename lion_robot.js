/*
 * Lion Robot
 * 
 * 
 * 
 * */


var Cylon = require('cylon');

// Update Bluetooth ports with real values, add or remove robots 
var bots = [
  { port: '/dev/rfcomm0', name: 'Lion1' },
  { port: '/dev/rfcomm1', name: 'Lion2' },
  { port: '/dev/rfcomm2', name: 'Lion3' },
  { port: '/dev/rfcomm3', name: 'Lion4' }
];

// Lion colors
var lion_color = 0xFFCC33;
var lion_color_impact = 0xFFFF00;
var lion_color_dead = 0x000000;

// Lion speed: between 1 and 100
var lion_speed = 60;

var LionRobot = (function() {
  function LionRobot() {}

  LionRobot.prototype.connection = [
  	{ name: 'Sphero', adaptor: 'sphero' },
  	{ name: 'skynet', adaptor: 'skynet', uuid: "eee99e91-58aa-11e4-a406-e361fc970baa", token: "3vlrauvp274d9529ppan51ag3hr27qfr" };
  ];
  
  LionRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  LionRobot.prototype.born = function() {
    // On creation, set the default direction and color
    this.lion_direction = 0;
    this.sphero.setRGB(lion_color);
  };

  LionRobot.prototype.move = function() {
    this.sphero.roll(lion_speed, this.lion_direction);
  };

  // Main Robot logic
  LionRobot.prototype.work = function(me) {
    me.born();

    me.sphero.on('collision', function() {
      // On collision, change color
      this.sphero.setRGB(lion_color_impact);
      this.sphero.setRGB(lion_color);
    });
	
	every((5).second(), function() {
      // Generate a randon direction 0-360
      this.lion_direction = Math.floor(Math.random() * 360);
      console.log('Lion direction: '+lion_direction);
      // Post direction to Skynet chatroom
      my.skynet.message({
		  "devices": "eee99e91-58aa-11e4-a406-e361fc970baa",
		  "payload": {"direction": this.lion_direction}
	  });
	  // Move
      me.move();
    });
  };

  return LionRobot;

})();

// Create the robots
for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = new LionRobot;

  robot.connection.port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

// Run Cylon
Cylon.start();