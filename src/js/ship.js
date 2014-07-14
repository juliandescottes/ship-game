window.onload = function() {

    var game = null;

    var startGame =function () {
      game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update : update });
    };

    var player = null;
    var cursors;
    var assets = {};

    function createCanvas(width, height) {
      var canvas = document.createElement("canvas");
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      return canvas;
    }

    var imgOnload = function(asset, index) {
      var img = this;
      var canvas;
      if (!asset.canvas) {
        canvas = createCanvas(img.width, img.height);
      } else {
        canvas = createCanvas(asset.canvas.width + img.width, img.height);
        canvas.getContext('2d').drawImage(asset.canvas, 0, 0);
      }
      asset.canvas = canvas;
      canvas.getContext('2d').drawImage(img, asset.canvas.width - img.width, 0);
      if (asset.urls[index+1]) {
        loadAssetAt(asset, index+1);
      } else {
        assetLoaded(asset);
      }
    };

    var assetLoaded = function (asset) {
      asset.loaded = true;
      var done = Object.keys(assets).every(function (assetKey) {
        return assets[assetKey].loaded;
      });
      if (done) {
        startGame();
      }
    };

    var loadAssetAt = function(asset, index) {
      var img = new Image();
      img.onload = imgOnload.bind(img, asset, index);
      img.src = asset.urls[index];
    };

    function combineAssets (key, urls) {
      var asset = {canvas : null, urls : urls};
      assets[key] = asset;
      loadAssetAt(asset, 0);
    }

    function prepareAssets () {
      combineAssets('boy', [
        'assets/ship_boy_walking_right.png',
        'assets/ship_boy_walking_left.png',
        'assets/ship_boy_running_right.png',
        'assets/ship_boy_running_left.png',
        'assets/ship_boy_walking_up.png',
        'assets/ship_boy_walking_down.png',
        'assets/ship_boy_running_up.png',
        'assets/ship_boy_running_down.png'
      ]);
    }

    prepareAssets();

    function preload () {
      game.load.spritesheet('boy', assets.boy.canvas.toDataURL('image/png'), 32, 32);
    }

    function create () {

      game.stage.smoothed = false;
      // The player and its settings
      player = game.add.sprite(64, game.world.height - 150, 'boy');
      player.scale.setTo(4, 4);

      //  We need to enable physics on the player
      game.physics.enable(player, Phaser.Physics.ARCADE);

      //  Player physics properties. Give the little guy a slight bounce.
      // player.body.bounce.y = 0;
      // player.body.gravity.y = 100;
      player.body.collideWorldBounds = true;

      //  Our two animations, walking left and right.
      player.animations.add('right', [1, 2, 3, 0], 7, true);
      player.animations.add('left', [5, 6, 7, 4], 7, true);
      player.animations.add('right.run', [9, 10, 11, 8], 12, true);
      player.animations.add('left.run', [13, 14, 15, 12], 12, true);
      player.animations.add('up', [17, 18, 19, 16], 7, true);
      player.animations.add('down', [21, 22, 23, 20], 7, true);
      player.animations.add('up.run', [25, 26, 27, 24], 12, true);
      player.animations.add('down.run', [29, 30, 31, 28], 12, true);

      cursors = game.input.keyboard.createCursorKeys();
    }

    function update () {
      //  Reset the players velocity (movement)
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;

      var directions = [cursors.left, cursors.up, cursors.down, cursors.right];
      directions = directions.filter(function (d) {
        return d.isDown;
      });

      directions = directions.sort(function (d1, d2) {
        if (d1.timeDown < d2.timeDown) return 1;
        if (d1.timeDown > d2.timeDown) return -1;
        return 0;
      });

      if (directions.length) {
        var selectedDir = directions[0];
        var speedBoost = 0, animationSuffix = '', baseSpeed = 150;

        // Run MODE
        if (game.input.keyboard.event.shiftKey) {
          speedBoost = 70;
          animationSuffix ='.run';
        }

        if (selectedDir === cursors.left) {

          player.body.velocity.x = -(baseSpeed + speedBoost);
          player.animations.play('left' + animationSuffix);
          player.lastDirection = 'left';

        } else if (selectedDir === cursors.right) {

          player.body.velocity.x = (baseSpeed + speedBoost);
          player.animations.play('right' + animationSuffix);
          player.lastDirection = 'right';

        } else if (selectedDir === cursors.up) {

          player.body.velocity.y = -(baseSpeed + speedBoost);
          player.animations.play('up' + animationSuffix);
          player.lastDirection = 'up';

        } else if (selectedDir === cursors.down) {

          player.body.velocity.y = (baseSpeed + speedBoost);
          player.animations.play('down' + animationSuffix);
          player.lastDirection = 'down';

        }

      } else {
          //  Stand still
          player.animations.stop();
          if (player.lastDirection == 'right') {
            player.frame = 0;
          } else if (player.lastDirection == 'left') {
            player.frame = 4;
          } else if (player.lastDirection == 'up') {
            player.frame = 16;
          } else if (player.lastDirection == 'down') {
            player.frame = 20;
          }
      }

      //  Allow the player to jump if they are touching the ground.
      if (cursors.up.isDown && player.body.touching.down)
      {
          player.body.velocity.y = -350;
      }

    }

};