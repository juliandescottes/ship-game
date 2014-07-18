(function () {
  var Room = function (walls, doors) {
    this.walls = walls;
    this.doors = doors;
  };

  Room.prototype.init = function (game) {

  }

  window.model = window.model || {};
  window.model.Room = Room;
})();