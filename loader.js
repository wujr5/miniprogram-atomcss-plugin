const fs = require('fs');

let oClassNameMap = {
  // margin
  '.m': 'margin:$rpx;',
  '.ml': 'margin-left:$rpx;',
  '.mr': 'margin-right:$rpx;',
  '.mt': 'margin-top:$rpx;',
  '.mb': 'margin-bottom:$rpx;',
  '.mx': 'margin-left:$rpx;margin-right:$rpx;',
  '.my': 'margin-top:$rpx;margin-bottom:$rpx;',
  // margin !important
  '.mi': 'margin:$rpx !important;',
  '.mli': 'margin-left:$rpx !important;',
  '.mri': 'margin-right:$rpx !important;',
  '.mti': 'margin-top:$rpx !important;',
  '.mbi': 'margin-bottom:$rpx !important;',
  '.mxi': 'margin-left:$rpx !important;margin-right:$rpx !important;',
  '.myi': 'margin-top:$rpx !important;margin-bottom:$rpx !important;',
  // padding
  '.p': 'padding:$rpx;',
  '.pl': 'padding-left:$rpx;',
  '.pr': 'padding-right:$rpx;',
  '.pt': 'padding-top:$rpx;',
  '.pb': 'padding-bottom:$rpx;',
  '.px': 'padding-left:$rpx;padding-right:$rpx;',
  '.py': 'padding-top:$rpx;padding-bottom:$rpx;',
  // padding !important
  '.pi': 'padding:$rpx !important;',
  '.pli': 'padding-left:$rpx !important;',
  '.pri': 'padding-right:$rpx !important;',
  '.pti': 'padding-top:$rpx !important;',
  '.pbi': 'padding-bottom:$rpx !important;',
  '.pxi': 'padding-left:$rpx !important;padding-right:$rpx !important;',
  '.pyi': 'padding-top:$rpx !important;padding-bottom:$rpx !important;',
  // width
  '.w': 'width:$rpx;',
  '.wi': 'width:$rpx !important;',
  '.mw': 'min-width:$rpx;',
  '.wp': 'width:$%;',
  '.wpi': 'width:$% !important;',
  // height
  '.h': 'height:$rpx;',
  '.hi': 'height:$rpx !important;',
  '.mh': 'min-height:$rpx;',
  '.hp': 'height:$%;',
  '.hpi': 'height:$% !important;',
  // 四方向
  '.l': 'left:$rpx;',
  '.r': 'right:$rpx;',
  '.t': 'top:$rpx;',
  '.b': 'bottom:$rpx;',
  // 行高
  '.lh': 'line-height:$rpx;',
  // 字体
  '.fs': 'font-size:$rpx;',
  '.fw': 'font-weight:$;',
  // background
  '.bgs': 'background-size:$rpx;',
  // border
  '.br': 'border-radius:$rpx;'
};

let oAtomConfig = {}

// 读取配置文件，如果不存在，就是用默认的配置文件
try {
  oAtomConfig = require(__dirname + '/../../atomcss.config.js');
} catch (e) {
  oAtomConfig = require(__dirname + '/dist/atomcss.config.js');
}

oClassNameMap = Object.assign(oClassNameMap, oAtomConfig);

// 生成正则表达式
let sAtomRegExp = '';
for (let key in oClassNameMap) {
  let value = oClassNameMap[key];

  // 数值原子类的正则
  if (value.indexOf('$') != -1) {
    sAtomRegExp += `\\${key}-[0-9]+|`;
  // 通用原子类的正则
  } else {
    sAtomRegExp += `\\${key}|`
  }
}

// 去掉最后一个 | 符号
sAtomRegExp = sAtomRegExp.substr(0, sAtomRegExp.length - 1);

module.exports = function(sSource) {
  let atomReg = new RegExp(sAtomRegExp, 'ig');

  let sClassString = '.' + (sSource.match(/class=("|')([a-zA-Z0-9 \- _]*)("|')/ig) || []).map(item => item.replace(/class=('|")|("|')/g, '').split(' ').join('.')).join('.');

  // 获取 pc 端原子类类名数组，并剔除重复的类名
  function uniq(value, index, self) {
    return self.indexOf(value) === index;
  }
  let aClassName = (sClassString.match(atomReg) || []).filter(uniq);

  // 原子类样式接收数组
  let aStyleStr = [];

  // 开始生成原子类
  aClassName.forEach(item => {
    let sKey;

    if (/\d+/.test(item)) {
      sKey = item.match(/\.\w+/)[0];
    } else {
      sKey = item;
    }

    let nValue;

    // 百分比数值，字重，无需使用单位
    if (['.wp', '.hp', '.fw'].includes(sKey)) {
      nValue = item.match(/\d+/)[0];
    } else {
      /\d+/.test(item) && (nValue = +item.match(/\d+/)[0]);
    }

    aStyleStr.push(`${item}{${oClassNameMap[sKey].replace(/\$/g, nValue)}}`);
  });

  return `'' + '${aStyleStr.join('')}'`;
}
