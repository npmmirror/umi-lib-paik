"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocaleFileList = getLocaleFileList;
exports.getLocaleFileListNew = getLocaleFileListNew;
exports.isNeedPolyfill = isNeedPolyfill;
exports.default = _default;

var _path = require("path");

var _fs = require("fs");

var _umiUtils = require("umi-utils");

var _mustache = _interopRequireDefault(require("mustache"));

var _globby = _interopRequireDefault(require("globby"));

var _lodash = _interopRequireDefault(require("lodash.groupby"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var momentLocation = require.resolve('moment/locale/zh-cn').replace(/zh-cn\.js$/, '');

var antLocation = require.resolve('antd/lib/locale-provider/zh_CN').replace(/zh_CN\.js$/, '');

function getMomentLocale(lang, country, momentLocaleMap) {
  if (country && (0, _fs.existsSync)((0, _path.join)(momentLocation, "".concat(lang, "-").concat(country.toLocaleLowerCase(), ".js")))) {
    return "".concat(lang, "-").concat(country.toLocaleLowerCase());
  }

  if ((0, _fs.existsSync)((0, _path.join)(momentLocation, "".concat(lang, ".js")))) {
    return lang;
  }

  if (momentLocaleMap && momentLocaleMap[lang] && (0, _fs.existsSync)((0, _path.join)(momentLocation, "".concat(momentLocaleMap[lang], ".js")))) {
    return momentLocaleMap[lang];
  }

  return '';
}

function getAntdLocale(lang, country, antLocaleMap) {
  if (country && (0, _fs.existsSync)((0, _path.join)(antLocation, "".concat(lang, "_").concat(country, ".js")))) {
    return "".concat(lang, "_").concat(country);
  }

  if (antLocaleMap && antLocaleMap[lang] && (0, _fs.existsSync)((0, _path.join)(antLocation, "".concat(antLocaleMap[lang], ".js")))) {
    return antLocaleMap[lang];
  }

  return '';
} // export for test


function getLocaleFileList() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  var absSrcPath = arg[0],
      absPagesPath = arg[1],
      singular = arg[2],
      momentLocaleMap = arg[3],
      antLocaleMap = arg[4];
  var localeFileMath = /^([a-z]{2})-([A-Z]{2})\.(js|ts|json)$/;
  var localeFolder = singular ? 'locale' : 'locales';

  var localeFiles = _globby.default.sync('*.{ts,js,json}', {
    cwd: (0, _path.join)(absSrcPath, localeFolder)
  }).map(function (name) {
    return (0, _path.join)(absSrcPath, localeFolder, name);
  }).concat(_globby.default.sync("**/".concat(localeFolder, "/*.{ts,js,json}"), {
    cwd: absPagesPath
  }).map(function (name) {
    return (0, _path.join)(absPagesPath, name);
  })).filter(function (p) {
    return localeFileMath.test((0, _path.basename)(p));
  }).map(function (fullname) {
    var fileName = (0, _path.basename)(fullname);
    var fileInfo = localeFileMath.exec(fileName);
    return {
      name: "".concat(fileInfo[1], "-").concat(fileInfo[2]),
      path: fullname
    };
  });

  var groups = (0, _lodash.default)(localeFiles, 'name');
  return Object.keys(groups).map(function (name) {
    var fileInfo = name.split('-');
    var paths = groups[name].map(function (item) {
      return (0, _umiUtils.winPath)(item.path);
    });
    var newPaths = paths.map(function (url) {
      return {
        url: url,
        affter: (0, _path.extname)(url).replace('.', '') === 'json' ? '' : '.default'
      };
    });
    return {
      lang: fileInfo[0],
      name: name,
      country: fileInfo[1],
      paths: newPaths,
      antdLocale: getAntdLocale(fileInfo[0], fileInfo[1], antLocaleMap),
      momentLocale: getMomentLocale(fileInfo[0], fileInfo[1], momentLocaleMap)
    };
  });
} // export for test


function getLocaleFileListNew() {
  for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    arg[_key2] = arguments[_key2];
  }

  var absSrcPath = arg[0],
      singular = arg[1],
      momentLocaleMap = arg[2],
      antLocaleMap = arg[3];
  var localeList = [];
  var localePath = (0, _path.join)(absSrcPath, singular ? 'locale' : 'locales');

  if ((0, _fs.existsSync)(localePath)) {
    var localePaths = readdirSync(localePath);

    for (var i = 0; i < localePaths.length; i++) {
      var fullname = (0, _path.join)(localePath, localePaths[i]);
      var stats = statSync(fullname);
      var fileInfo = /^([a-z]{2})-([A-Z]{2})\.(js|ts|json)$/.exec(localePaths[i]);

      if (stats.isFile() && fileInfo) {
        localeList.push({
          lang: fileInfo[1],
          country: fileInfo[2],
          name: "".concat(fileInfo[1], "-").concat(fileInfo[2]),
          paths: (0, _umiUtils.winPath)(fullname),
          antdLocale: getAntdLocale(fileInfo[0], fileInfo[1], antLocaleMap),
          momentLocale: getMomentLocale(fileInfo[1], fileInfo[2], momentLocaleMap)
        });
      }
    }
  }

  return localeList;
} // data come from https://caniuse.com/#search=intl
// you can find all browsers in https://github.com/browserslist/browserslist#browsers


var polyfillTargets = {
  ie: 10,
  firefox: 28,
  chrome: 23,
  safari: 9.1,
  opera: 12.1,
  ios: 9.3,
  ios_saf: 9.3,
  operamini: Infinity,
  op_mini: Infinity,
  android: 4.3,
  blackberry: Infinity,
  operamobile: 12.1,
  op_mob: 12.1,
  explorermobil: 10,
  ie_mob: 10,
  ucandroid: Infinity
};

function isNeedPolyfill() {
  var targets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(targets).find(function (key) {
    return polyfillTargets[key.toLocaleLowerCase()] && polyfillTargets[key.toLocaleLowerCase()] >= targets[key];
  }) !== undefined;
}

function getOpts(key, options) {
  if (key === 'translate') {
    var transLateSupport = options.transLateSupport;
    return {
      support: _objectSpread({}, transLateSupport || {})
    };
  }

  return {};
}

function _default(api) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = api.config,
      paths = api.paths;
  var targets = config.targets;
  var momentLocaleMap = options.momentLocaleMap || undefined;
  var antLocaleMap = options.antLocaleMap || undefined;
  var localeMap = options.localeMap || undefined;
  var defaultLocale = options.default || 'zh-CN';

  if (isNeedPolyfill(targets)) {
    api.addEntryPolyfillImports({
      source: 'intl'
    });
  }

  api.addPageWatcher((0, _path.join)(paths.absSrcPath, config.singular ? 'locale' : 'locales'));
  api.onOptionChange(function (newOpts) {
    options = newOpts;
    api.rebuildTmpFiles();
  });
  api.addRendererWrapperWithComponent(function () {
    var localeFileList = getLocaleFileList(paths.absSrcPath, paths.absPagesPath, config.singular, momentLocaleMap, antLocaleMap);
    var wrapperTpl = (0, _fs.readFileSync)((0, _path.join)(__dirname, './template/wrapper.jsx.tpl'), 'utf-8');

    var _defaultLocale$split = defaultLocale.split('-'),
        _defaultLocale$split2 = _slicedToArray(_defaultLocale$split, 2),
        lang = _defaultLocale$split2[0],
        country = _defaultLocale$split2[1];

    var list = [];

    if (localeMap) {
      var locales = Object.keys(localeMap);

      var _list = locales.map(function (lang) {
        var findLocale = localeFileList.find(function (o) {
          return o.name === localeMap[lang];
        });
        return _objectSpread({}, findLocale, {
          name: lang
        });
      });

      list = _list;
    }

    var localeList = localeFileList.concat(list);
    var momentLocale = [];
    localeList.map(function (locale) {
      momentLocale.push(locale.momentLocale);
      return locale;
    });

    var wrapperContent = _mustache.default.render(wrapperTpl, {
      localeList: localeList,
      momentLocaleList: Array.from(new Set(momentLocale)),
      antd: options.antd === undefined ? true : options.antd,
      baseNavigator: options.baseNavigator === undefined ? true : options.baseNavigator,
      useLocalStorage: true,
      defaultLocale: defaultLocale,
      defaultLang: lang,
      defaultAntdLocale: getAntdLocale(lang, country, antLocaleMap),
      defaultMomentLocale: getMomentLocale(lang, country, momentLocaleMap)
    });

    var wrapperPath = (0, _path.join)(paths.absTmpDirPath, './LocaleWrapper.jsx');
    (0, _fs.writeFileSync)(wrapperPath, wrapperContent, 'utf-8');
    return wrapperPath;
  });
  var plugins = {
    // translate
    translate: function translate() {
      return require('./translate').default;
    }
  };
  Object.keys(plugins).forEach(function (key) {
    if (options[key]) {
      api.registerPlugin({
        id: "umi-plugin-locale-paik:".concat(key),
        apply: plugins[key](),
        opts: getOpts(key, options)
      });
    }
  });
  api.modifyAFWebpackOpts(function (memo) {
    var _options = options,
        dynamicIntl = _options.dynamicIntl;

    var opt = _objectSpread({}, memo, {
      alias: _objectSpread({}, memo.alias || {}, {
        'umi/locale': (0, _path.join)(__dirname, './locale.js'),
        'react-intl': (0, _path.dirname)(require.resolve('react-intl/package.json'))
      })
    });

    if (dynamicIntl) {
      opt.alias['umi/withIntl'] = (0, _path.join)(__dirname, './withIntl/index.js');
    }

    return opt;
  });
}