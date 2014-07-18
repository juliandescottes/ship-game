window.onload = function() {

    var ROOM_WIDTH = 24, ROOM_HEIGHT = 15, ROOM_TILE_SIZE = 32;

    var game = null, player = null, room = null, cursors = null;
    var assets = [];

    var roomTranslator = new window.model.RoomTranslator();

    var startGame =function () {
      game = new Phaser.Game(ROOM_TILE_SIZE * ROOM_WIDTH, ROOM_TILE_SIZE * ROOM_HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update : update });
    };

    window.buildAssets({
      assets : {
        'boy' : [
          'assets/ship_boy_walking_right.png',
          'assets/ship_boy_walking_left.png',
          'assets/ship_boy_walking_up.png',
          'assets/ship_boy_walking_down.png',
          'assets/ship_boy_running_right.png',
          'assets/ship_boy_running_left.png',
          'assets/ship_boy_running_up.png',
          'assets/ship_boy_running_down.png'
        ],
        'room.1' : ['assets/rooms/room.1.png']
      },
      onAssetCombined : function (key, canvas) {
        assets[key] = canvas;
      },
      onComplete : function () {
        startGame();
      }
    });

    function preload () {
      game.load.spritesheet('boy', assets.boy.toDataURL('image/png'), 32, 32);


      game.load.image('tiles.room', 'assets/rooms/tiles.png');
      game.load.tilemap('room.1', 'assets/rooms/room.1.json', null, Phaser.Tilemap.TILED_JSON);

      // var room1 = createRoom('room.1');
    }

    function create () {
      createRoom();

      game.stage.smoothed = false;
      player = createPlayer();

      player.x = 100;
      player.y = 100;

      cursors = game.input.keyboard.createCursorKeys();
    }

    function createPlayer () {
      // The player and its settings
      var player = game.add.sprite(-1000, -1000, 'boy');
      player.crop(new Phaser.Rectangle(9, 2, 14, 24));
      player.scale.setTo(4, 4);

      //  We need to enable physics on the player
      game.physics.enable(player, Phaser.Physics.ARCADE);

      //  Player physics properties. Give the little guy a slight bounce.
      player.body.collideWorldBounds = true;

      player.animations.add('right', [1, 2, 3, 0], 7, true);
      player.animations.add('left', [5, 6, 7, 4], 7, true);
      player.animations.add('up', [9, 10, 11, 8], 7, true);
      player.animations.add('down', [13, 14, 15, 12], 7, true);
      player.animations.add('right.run', [17, 18, 19, 16], 12, true);
      player.animations.add('left.run', [21, 22, 23, 20], 12, true);
      player.animations.add('up.run', [25, 26, 27, 24], 12, true);
      player.animations.add('down.run', [29, 30, 31, 28], 12, true);

      return player;
    }

    // function createRoom (key) {
    //   var room = roomTranslator.imageToRoom(assets[key]);
    //   return null;
    // }

    function getSelectedDirection () {
      var selectedDirection = null;

      var directions = ['left', 'up', 'down', 'right'];
      directions = directions.filter(function (d) {
        return cursors[d].isDown;
      });
      if (directions.length) {
        directions = directions.sort(function (d1, d2) {
          if (cursors[d1].timeDown > cursors[d2].timeDown) return -1;
          if (cursors[d1].timeDown < cursors[d2].timeDown) return 1;
          return 0;
        });
        selectedDirection = directions[0];
      }

      return selectedDirection;
    }

    function update () {
      //  Reset the players velocity (movement)
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;

      var dir = getSelectedDirection();
      if (dir) {
        moveTowards(dir);
      } else {
        standStill();
      }
    }

    function moveTowards (dir) {
      var animationSuffix = '';
      var speed = 150;

      var isRunning = game.input.keyboard.event.shiftKey;
      if (isRunning) {
        speed += 70;
        animationSuffix ='.run';
      }

      if ('right' === dir)  player.body.velocity.x = speed;
      if ('left'  === dir)  player.body.velocity.x = -speed;
      if ('up'    === dir)  player.body.velocity.y = -speed;
      if ('down'  === dir)  player.body.velocity.y = speed;

      player.animations.play(dir + animationSuffix);
      player.lastDirection = dir;
    }

    function standStill () {
      player.animations.stop();
      var dir = player.lastDirection;
      if ('right' === dir)  player.frame = 0;
      if ('left'  === dir)  player.frame = 4;
      if ('up'    === dir)  player.frame = 8;
      if ('down'  === dir)  player.frame = 12;
    }

    function createRoom () {
      var roomWrapper = {};

      var room = game.add.tilemap('room.1');
      room.addTilesetImage('tiles', 'tiles.room');
      var layer = room.createLayer('tiles');
      // room.setCollisionBetween(1, 6);
      layer.resizeWorld();

      var doors = game.add.group();
      var walls = game.add.group();

      // room.createFromObjects('tiles', 2, 'door', 0, true, false, doors);
      // room.createFromObjects('tiles', 1, 'wall', 0, true, false, walls);

      // walls.forEach(function(wall) {
      //   game.physics.arcade.enable(wall);
      // }, this);

      // doors.forEach(function(d) {
      //   game.physics.arcade.enable(d);
      // }, this);
  }

};