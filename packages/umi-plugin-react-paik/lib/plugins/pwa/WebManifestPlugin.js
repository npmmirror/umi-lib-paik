"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _fs = require("fs");

var _path = require("path");

var _generateWebManifest = require("./generateWebManifest");

var WebManifestPlugin =
/*#__PURE__*/
function () {
  function WebManifestPlugin(options) {
    (0, _classCallCheck2.default)(this, WebManifestPlugin);
    this.options = options;
  }

  (0, _createClass2.default)(WebManifestPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this$options = this.options,
          publicPath = _this$options.publicPath,
          srcPath = _this$options.srcPath,
          outputPath = _this$options.outputPath,
          pkgName = _this$options.pkgName; // our default manifest

      var rawManifest = {
        name: pkgName,
        short_name: pkgName,
        display: 'fullscreen',
        scope: '/',
        start_url: './?homescreen=true',
        orientation: 'portrait'
      };
      compiler.hooks.emit.tap('generate-webmanifest', function (compilation) {
        if (srcPath) {
          try {
            rawManifest = JSON.parse((0, _fs.readFileSync)(srcPath, 'utf8'));
          } catch (e) {
            compilation.errors.push(new Error("Please check ".concat(srcPath, ", a WebManifest should be a valid JSON file.")));
            return;
          }
        }

        rawManifest.icons && rawManifest.icons.forEach(function (icon) {
          icon.src = (0, _generateWebManifest.prependPublicPath)(publicPath, icon.src);
        }); // write manifest & pwacompat.js to filesystem

        [{
          path: outputPath,
          content: JSON.stringify(rawManifest)
        }, {
          path: _generateWebManifest.PWACOMPAT_PATH,
          content: (0, _fs.readFileSync)((0, _path.join)(__dirname, _generateWebManifest.PWACOMPAT_PATH))
        }].forEach(function (_ref) {
          var path = _ref.path,
              content = _ref.content;
          compilation.assets[path] = {
            source: function source() {
              return content;
            },
            size: function size() {
              return content.length;
            }
          };
        });
      });
    }
  }]);
  return WebManifestPlugin;
}();

exports.default = WebManifestPlugin;