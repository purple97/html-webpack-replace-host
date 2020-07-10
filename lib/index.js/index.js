"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* 
* 
*/
var HtmlWebpackReplaceHost = /*#__PURE__*/function () {
  function HtmlWebpackReplaceHost(options) {
    _classCallCheck(this, HtmlWebpackReplaceHost);

    this.replacePluginInfo = options;
  }

  _createClass(HtmlWebpackReplaceHost, [{
    key: "apply",
    value: function apply(compiler) {
      var self = this;
      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-alter-asset-tags', function (data) {
          data.head = self._handleChunksConfig(data.head, data.plugin.options.version);
          data.body = self._handleChunksConfig(data.body, data.plugin.options.version);
        });
      });
    }
  }, {
    key: "_handleChunksConfig",
    value: function _handleChunksConfig(tags, version) {
      var _this = this;

      var _tags = [].concat(tags);

      if (this.replacePluginInfo) {
        _tags.map(function (tag) {
          if (tag.tagName === 'script' && tag.attributes) {
            // console.log('\n');
            // console.log('info:', tag, this.replacePluginInfo.replaceString, version);
            // console.log('\n');
            tag = _this._setAttributesSrc(tag, _this.replacePluginInfo.replaceString, version);
          }

          return tag;
        });
      }

      return _tags;
    }
  }, {
    key: "_setAttributesSrc",
    value: function _setAttributesSrc(tag, replaceStr, version) {
      var regex = new RegExp(/^[../]*/);

      if (process.env.NODE_ENV == 'daily' || process.env.NODE_ENV == 'local') {
        tag.attributes = Object.assign({}, tag.attributes, {
          src: './' + version + '/index.js'
        });
      } else if (tag.attributes.src && tag.attributes.src.match(regex)) {
        var _src = replaceStr ? tag.attributes.src.replace(regex, replaceStr) : tag.attributes.src.replace(regex, './').replace(/src\/[\w/]*\//, '');

        if (tag.attributes.src.match(/javascripts\/build\//)) {
          _src = _src.replace('javascripts/build/', '');
        }

        if (!_src.match(/\/[.\d]*/)) {
          _src = _src.replace(/\/index\.js/, '/' + version + '/index.js');
        }

        tag.attributes = Object.assign({}, tag.attributes, {
          src: _src
        });
      }

      return tag;
    }
  }]);

  return HtmlWebpackReplaceHost;
}();

module.exports = HtmlWebpackReplaceHost;