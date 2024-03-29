/*
 * dezhao.chen
 */
class HtmlWebpackReplaceHost {
    constructor(options) {
        this.replacePluginInfo = options;
    }

    apply(compiler) {
        var self = this;
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-alter-asset-tags', (data) => {
                data.head = self._handleChunksConfig(data.head, data.plugin.options.version);
                data.body = self._handleChunksConfig(data.body, data.plugin.options.version);
            });
        });
    }

    _handleChunksConfig(tags, version) {
        var _tags = [].concat(tags);
        if (this.replacePluginInfo) {
            _tags.map((tag) => {
                if (tag.tagName === 'script' && tag.attributes) {
                    // console.log('\n');
                    // console.log('info:', tag, this.replacePluginInfo.replaceString, version);
                    // console.log('\n');
                    tag = this._setAttributesSrc(tag, this.replacePluginInfo.replaceString, version);
                }
                return tag;
            });
        }
        return _tags;
    }

    _setAttributesSrc(tag, replaceStr, version) {
        var regex = new RegExp(/^(-|\/|\w|\.)*\/build\//);
        if (process.env.NODE_ENV == 'daily' || process.env.NODE_ENV == 'local') {
            tag.attributes = Object.assign({}, tag.attributes, {
                src: tag.attributes.src.replace(/\.\/.*index.js/, './' + version + '/index.js')
            });
        } else if (tag.attributes.src && tag.attributes.src.match(regex)) {
            let _src = replaceStr
                ? tag.attributes.src.replace(regex, replaceStr)
                : tag.attributes.src.replace(regex, './').replace(/src\/[\w/]*\//, '');
            // if (tag.attributes.src.match(/javascripts\/build\//)) {
            //     _src = _src.replace('javascripts/build/', '');
            // }

            if (!_src.match(/\/[.\d]*/)) {
                _src = _src.replace(/\/index\.js/, '/' + version + '/index.js');
            }
            tag.attributes = Object.assign({}, tag.attributes, { src: _src });
        }
        return tag;
    }
}

module.exports = HtmlWebpackReplaceHost;
