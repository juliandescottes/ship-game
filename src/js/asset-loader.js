(function () {
  var assets = {};

  function createCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    return canvas;
  }

  var AssetBuilder = function (assetConfigurations, onAssetCombined, onComplete) {
    this.assetConfigurations = assetConfigurations;
    this.assetKeys = Object.keys(assetConfigurations);
    this.assetCanvasMap = {};

    this.assetsLoadedCounter = 0;

    this.onAssetCombined = onAssetCombined;
    this.onComplete = onComplete;
  };

  AssetBuilder.prototype.build = function () {
    this.assetKeys.forEach(this.combineAssetsForKey.bind(this));
  };

  AssetBuilder.prototype.combineAssetsForKey = function (key) {
    this.assetCanvasMap[key] = createCanvas(0, 0);
    this.loadAssetForKeyAt(key, 0);
  };

  AssetBuilder.prototype.loadAssetForKeyAt = function(key, index) {
    var image = new Image();
    image.onload = this.onImageLoaded.bind(this, image, key, index);
    image.src = this.assetConfigurations[key][index];
  };

  AssetBuilder.prototype.onImageLoaded = function(image, key, index) {
    var existingCanvas = this.assetCanvasMap[key];
    var canvas = createCanvas(existingCanvas.width + image.width, image.height);
    canvas.getContext('2d').drawImage(existingCanvas, 0, 0);
    canvas.getContext('2d').drawImage(image, canvas.width - image.width, 0);
    // replace canvas by new one
    this.assetCanvasMap[key] = canvas;

    if (this.assetConfigurations[key][index+1]) {
      this.loadAssetForKeyAt(key, index+1);
    } else {
      this.onAssetLoaded(key);
    }
  };

  AssetBuilder.prototype.onAssetLoaded = function (key) {
    this.onAssetCombined(key, this.assetCanvasMap[key]);

    this.assetsLoadedCounter++;
    if (this.assetsLoadedCounter === this.assetKeys.length) {
      this.onComplete();
    }
  };

  window.buildAssets = function (cfg) {
    var assetConfigurations = cfg.assets,
        onAssetCombined = cfg.onAssetCombined,
        onComplete = cfg.onComplete;

    var assetBuilder = new AssetBuilder(assetConfigurations, onAssetCombined, onComplete);
    assetBuilder.build();
  };
})();
