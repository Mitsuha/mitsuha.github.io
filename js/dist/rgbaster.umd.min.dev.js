"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var color =
/*#__PURE__*/
function () {
  function color(r, g, b, a) {
    _classCallCheck(this, color);

    this.r = r;
    this.g = g;
    this.b = b;

    if (a) {
      this.a = a;
    } else {
      this.a = 255;
    }
  }

  _createClass(color, [{
    key: "most",
    value: function most() {
      if (this.r > this.g && this.r > this.b) {
        return 'r';
      }

      if (this.g > this.b) {
        return 'g';
      }

      return 'b';
    }
  }, {
    key: "string",
    value: function string() {
      if (this.a == 255) {
        return "rgb(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ")");
      }

      return "rgba(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ", ").concat(this.a, ")");
    }
  }], [{
    key: "fromList",
    value: function fromList(list) {
      return new color(list[0], list[1], list[2]);
    }
  }]);

  return color;
}();

var ColorSpace =
/*#__PURE__*/
function () {
  _createClass(ColorSpace, null, [{
    key: "fromUint8Array",
    value: function fromUint8Array(uint8Array) {
      var instance = new ColorSpace();
      instance.space = [];

      for (var i = 0; i < uint8Array.length - 4; i += 4) {
        instance.space.push(new color(uint8Array[i], uint8Array[i + 1], uint8Array[i + 2]));
      }

      return instance;
    }
  }]);

  function ColorSpace() {
    _classCallCheck(this, ColorSpace);

    this.space = [];
  }

  _createClass(ColorSpace, [{
    key: "add",
    value: function add(color) {
      this.space.push(color);
    }
  }, {
    key: "sideLength",
    value: function sideLength() {
      var max = {
        r: 0,
        g: 0,
        b: 0
      };
      var min = {
        r: 255,
        g: 255,
        b: 255
      };
      this.space.map(function (color) {
        // max color
        max.r = max.r < color.r ? color.r : max.r;
        max.g = max.g < color.g ? color.g : max.g;
        max.b = max.b < color.b ? color.b : max.b; // min color

        min.r = min.r > color.r ? color.r : min.r;
        min.g = min.g > color.g ? color.g : min.g;
        min.b = min.b > color.b ? color.b : min.b;
      });
      return new color(max.r - min.r, max.g - min.g, max.b - min.b);
    }
  }, {
    key: "split",
    value: function split(side) {
      // console.log(side) 
      var left = new ColorSpace();
      var right = new ColorSpace();
      var length = this.sideLength()[side];

      if (length == 1) {
        return [this];
      }

      var middle = ~~(length / 2) + this.zeropoint()[side];
      this.space.forEach(function (color) {
        if (color[side] > middle) {
          right.add(color);
        } else {
          left.add(color);
        }
      });
      return [left, right];
    }
  }, {
    key: "density",
    value: function density() {
      var cube = this.sideLength();
      return cube.r * cube.g * cube.b * this.space.length();
    }
  }, {
    key: "longestSide",
    value: function longestSide() {
      return this.sideLength().most();
    }
  }, {
    key: "zeropoint",
    value: function zeropoint() {
      var min = new color(255, 255, 255);
      this.space.map(function (color) {
        min.r = min.r > color.r ? color.r : min.r;
        min.g = min.g > color.g ? color.g : min.g;
        min.b = min.b > color.b ? color.b : min.b;
      });
      return min;
    }
  }, {
    key: "midpoint",
    value: function midpoint() {
      var max = {
        r: 0,
        g: 0,
        b: 0
      };
      var min = {
        r: 255,
        g: 255,
        b: 255
      };
      this.space.map(function (color) {
        // max color
        max.r = max.r < color.r ? color.r : max.r;
        max.g = max.g < color.g ? color.g : max.g;
        max.b = max.b < color.b ? color.b : max.b; // min color

        min.r = min.r > color.r ? color.r : min.r;
        min.g = min.g > color.g ? color.g : min.g;
        min.b = min.b > color.b ? color.b : min.b;
      });
      return new color(min.r + (max.r - min.r) / 2, min.g + (max.g - min.g) / 2, min.b + (max.b - min.b) / 2);
    }
  }]);

  return ColorSpace;
}();

var SteinsColor =
/*#__PURE__*/
function () {
  function SteinsColor() {
    _classCallCheck(this, SteinsColor);
  }

  _createClass(SteinsColor, [{
    key: "open",
    value: function open(url, callback) {
      var img = new Image();

      img.onload = function () {
        callback(img);
      };

      img.crossOrigin = "Anonymous";
      img.src = url;
    }
  }, {
    key: "imgData",
    value: function imgData(img, callback) {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      var data = context.getImageData(0, 0, img.width, img.height);
      callback(data);
    }
  }, {
    key: "getImageData",
    value: function getImageData(url, callback) {
      var that = this;
      this.open(url, function (imgObj) {
        that.imgData(imgObj, callback);
      });
    }
  }], [{
    key: "colors",
    value: function colors(url, block, callback) {
      var instance = new SteinsColor();
      instance.getImageData(url, function (imgObj) {
        var root = ColorSpace.fromUint8Array(imgObj.data);
        var cubeList = [root];
        var flag = 0; // let result = root.split(root.longestSide())
        // console.log(result[0].midpoint(), result[1].midpoint())
        // console.log(result[0].zeropoint(), result[1].zeropoint())

        while (true) {
          if (cubeList.length >= block) {
            break;
          }

          var cube = cubeList.splice(0, 1).pop();

          if (cube == undefined) {
            break;
          }

          if (flag != 0 && flag.space.length == cube.space.length) {
            break;
          }

          flag = cube;
          var result = cube.split(cube.longestSide());
          result.forEach(function (s) {
            if (s.space.length != 0) {
              cubeList.push(s);
            }
          }); // cubeList = cubeList.concat(...cube.split(cube.longestSide()))
        }

        for (var i = 0; i < cubeList.length; i++) {
          cubeList[i] = cubeList[i].midpoint();
        }

        callback(cubeList);
      });
    }
  }]);

  return SteinsColor;
}();