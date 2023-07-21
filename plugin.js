const fs = require('fs');

class MiniprogramAtomcssPlugin {
  static getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);

    for (var i in files) {
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()) {
        MiniprogramAtomcssPlugin.getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }

    return files_;
  }

  apply(compiler) {
    const pluginName = MiniprogramAtomcssPlugin.name;

    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          // 将所有原子类连接在一起
          let content = '';
          compilation.modules.forEach((module) => {
            content += eval(module._source._value);
          });

          // 去重
          function uniq(value, index, self) {
            return self.indexOf(value) === index;
          }
          content = content.split('.').filter(uniq).join('.');

          // 更新 output.filename 中指定的输出文件
          compilation.updateAsset(
            Object.keys(assets)[0],
            new RawSource(content)
          );
        }
      );
    });
  }
}

module.exports = MiniprogramAtomcssPlugin;
