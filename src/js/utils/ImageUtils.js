(function () {

  function createCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    return canvas;
  }

  var ImageUtils = {
    getPixels : function (image) {
      var w = image.width,
        h = image.height;
      var canvas = createCanvas(w, h);
      var context = canvas.getContext('2d');

      context.drawImage(image, 0,0,w,h,0,0,w,h);
      var imgData = context.getImageData(0,0,w,h).data;
      return window.utils.ImageUtils.getPixelsFromImageData(imgData, w, h);
    },

    forEachPixel : function (pixels, cb) {
      for (var x = 0 ; x < pixels.length ; x++) {
        for (var y = 0 ; y < pixels[x].length ; y++) {
          var color = pixels[x][y];
          cb(x, y, color);
        }
      }
    },

    getPixelsFromImageData : function (imageData, width, height) {
      // Draw the zoomed-up pixels to a different canvas context
      var pixels = [];
      for (var x = 0 ; x < width ; x++){
        pixels[x] = [];
        for (var y = 0 ; y < height ; y++){
          // Find the starting index in the one-dimensional image data
          var i = (y * width + x)*4;
          pixels[x][y] = {
            r : imageData[i  ],
            g : imageData[i+1],
            b : imageData[i+2],
            a : imageData[i+3]
          };
        }
      }
      return pixels;
    }
  };

  window.utils = window.utils || {};
  window.utils.ImageUtils = ImageUtils;
})();