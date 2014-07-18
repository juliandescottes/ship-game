(function () {
  var WALL_COLOR = {
    r : 200,
    g : 200,
    b : 200,
    a : 255
  };
  var DOOR_COLOR = {
    r : 255,
    g : 0,
    b : 0,
    a : 255
  };

  var sameColors = function (c1, c2) {
    return c1.r == c2.r && c1.g == c2.g && c1.b == c2.b && c1.a == c2.a;
  };

  var RoomTranslator = function () {};

  RoomTranslator.prototype.imageToRoom = function (image) {
    var pixels = window.utils.ImageUtils.getPixels(image);
    var walls = [];
    var doors = [];
    var floors = [];
    window.utils.ImageUtils.forEachPixel(pixels, function (x, y, color) {
      if (sameColors(color, WALL_COLOR)) {
        walls.push(x, y);
      } else if (sameColors(color, DOOR_COLOR)) {
        doors.push(x, y);
      } else {
        floors.push(x, y);
      }
    });
    return new window.model.Room(walls, doors);
  };

  window.model = window.model || {};
  window.model.RoomTranslator = RoomTranslator;
})();