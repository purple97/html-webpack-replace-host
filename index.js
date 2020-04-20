const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlWebpackReplaceHost {
    constructor(options) {
        this.replacePluginInfo = options;
    }

    apply(compiler) {
        const self = this;
        if (HtmlWebpackPlugin.getHooks) {
            compiler.hooks.compilation.tap('HtmlWebpackReplace', (compilation) => {
                HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('HtmlWebpackInjectorPlugin', (data, callback) => {
                    data.headTags = self._handleChunksConfig(data.headTags, data.plugin.options.version);
                    data.bodyTags = self._handleChunksConfig(data.bodyTags, data.plugin.options.version);
                    callback(null, data);
                });
            });
        } else {
            compiler.plugin('compilation', (compilation) => {
                compilation.plugin('html-webpack-plugin-alter-asset-tags', (data) => {
                    data.head = self._handleChunksConfig(data.head, data.plugin.options.version);
                    data.body = self._handleChunksConfig(data.body, data.plugin.options.version);
                });
            });
        }
    }
    _handleChunksConfig(tags, version) {
        const _tags = [].concat(tags);
        if (this.replacePluginInfo) {
            _tags.map((tag) => {
                if (tag.tagName === 'script' && tag.attributes) {
                    tag = this._setAttributesSrc(tag, this.replacePluginInfo.replaceString, version);
                }
                return tag;
            });
        }
        return _tags;
    }

    _setAttributesSrc(tag, replaceStr, version) {
        const regex = new RegExp(/^[../]*/);
        if (process.env.NODE_ENV == 'daily' || process.env.NODE_ENV == 'local') {
            tag.attributes = Object.assign({}, tag.attributes, { src: './' + version + '/index.js' });
        } else if (tag.attributes.src && tag.attributes.src.match(regex)) {
            let _src = replaceStr
                ? tag.attributes.src.replace(regex, replaceStr)
                : tag.attributes.src.replace(regex, './').replace(/src\/[\w/]*\//, '');
            if (tag.attributes.src.match(/javascripts\/build\//)) {
                _src = _src.replace('javascripts/build/', '');
            }
            if (!_src.match(/\/[.\d]*/)) {
                _src = _src.replace(/\/index\.js/, '/' + version + '/index.js');
            }
            tag.attributes = Object.assign({}, tag.attributes, { src: _src });
        }
        return tag;
    }
}

module.exports = HtmlWebpackReplaceHost;
