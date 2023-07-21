let oOriginClassNameMap = {
  // margin
  '.m': 'margin:$rpx',
  '.ml': 'margin-left:$rpx',
  '.mr': 'margin-right:$rpx',
  '.mt': 'margin-top:$rpx',
  '.mb': 'margin-bottom:$rpx',
  '.mx': 'margin-left:$rpx;margin-right:$rpx',
  '.my': 'margin-top:$rpx;margin-bottom:$rpx',
  // margin !important
  '.mi': 'margin:$rpx !important',
  '.mli': 'margin-left:$rpx !important',
  '.mri': 'margin-right:$rpx !important',
  '.mti': 'margin-top:$rpx !important',
  '.mbi': 'margin-bottom:$rpx !important',
  '.mxi': 'margin-left:$rpx !important;margin-right:$rpx !important',
  '.myi': 'margin-top:$rpx !important;margin-bottom:$rpx !important',
  // padding
  '.p': 'padding:$rpx',
  '.pl': 'padding-left:$rpx',
  '.pr': 'padding-right:$rpx',
  '.pt': 'padding-top:$rpx',
  '.pb': 'padding-bottom:$rpx',
  '.px': 'padding-left:$rpx;padding-right:$rpx',
  '.py': 'padding-top:$rpx;padding-bottom:$rpx',
  // padding !important
  '.pi': 'padding:$rpx !important',
  '.pli': 'padding-left:$rpx !important',
  '.pri': 'padding-right:$rpx !important',
  '.pti': 'padding-top:$rpx !important',
  '.pbi': 'padding-bottom:$rpx !important',
  '.pxi': 'padding-left:$rpx !important;padding-right:$rpx !important',
  '.pyi': 'padding-top:$rpx !important;padding-bottom:$rpx !important',
  // width
  '.w': 'width:$rpx',
  '.wi': 'width:$rpx !important',
  '.mw': 'min-width:$rpx',
  '.wp': 'width:$%',
  '.wpi': 'width:$% !important',
  // height
  '.h': 'height:$rpx',
  '.hi': 'height:$rpx !important',
  '.mh': 'min-height:$rpx',
  '.hp': 'height:$%',
  '.hpi': 'height:$% !important',
  // 四方向
  '.l': 'left:$rpx',
  '.r': 'right:$rpx',
  '.t': 'top:$rpx',
  '.b': 'bottom:$rpx',
  // 行高
  '.lh': 'line-height:$rpx',
  // 字体
  '.fs': 'font-size:$rpx',
  '.fw': 'font-weight:$',
  // background
  '.bgs': 'background-size:$rpx',
  // border
  '.br': 'border-radius:$rpx',
  // 颜色
  '.c': 'color: #',
  '.bgc': 'background-color: #',
};

let oAtomConfig = null;
let oClassNameMap = null;
let sAtomRegExp = null;

// 获取原子类正则表达式
function getAtomClassReg() {
  oClassNameMap = {
    ...oOriginClassNameMap,
    ...(oAtomConfig || {}),
  };

  // 生成正则表达式
  let aAtomRegExp = [];
  for (let key in oClassNameMap) {
    let value = oClassNameMap[key];

    // 数值原子类的正则
    if (value.indexOf('$') != -1) {
      aAtomRegExp.push(`\\${key}-[0-9]+`);
    }
    // 色值原子类正则
    else if (value.indexOf('#') != -1) {
      aAtomRegExp.push(`\\${key}-[0-9a-fA-F]+`);
      // 通用原子类的正则
    } else {
      aAtomRegExp.push(`\\${key}`);
    }
  }

  // 规则长的排在前面，保证全匹配
  aAtomRegExp.sort((a, b) => b.length - a.length);

  sAtomRegExp = aAtomRegExp.join('|');
  return sAtomRegExp;
}

// 从文件中提取所有类名
function getAllClassNameFromSource(sSource) {
  let sClassString =
    '.' +
    (
      sSource.match(
        /class=("|')([a-zA-Z0-9 \- _\{\}><\?\.'":\+\-\*\/\(\)\%\$\&\!\~\^\=]*)("|')/gi
      ) || []
    )
      .map((item) =>
        item
          .replace(/class=('|")|("|')/g, '')
          .split(' ')
          .join('.')
      )
      .join('.');

  return sClassString;
}

// 生成原子类
function generateAtomCss(sClassString) {
  // 获取原子类类名数组，并剔除重复的类名
  let atomReg = new RegExp(sAtomRegExp, 'ig');
  function uniq(value, index, self) {
    return self.indexOf(value) === index;
  }
  let aClassName = (sClassString.match(atomReg) || []).filter(uniq);

  // 原子类样式接收数组
  let aStyleStr = [];

  // 开始生成原子类
  aClassName.forEach((item) => {
    let bColorFlag =
      oClassNameMap[item.split('-')[0]] &&
      oClassNameMap[item.split('-')[0]].indexOf('$') == -1 &&
      oClassNameMap[item.split('-')[0]].indexOf('#') != -1 &&
      /^[0-9a-fA-F]+$/.test(item.split('-')[1]); // 十六进制

    // 色值类
    if (bColorFlag) {
      let tmp = item.split('-');
      if (tmp.length > 1) {
        let sKey = tmp.slice(0, tmp.length - 1).join('-');
        let nValue = '#' + tmp[tmp.length - 1];
        aStyleStr.push(
          `${item}{${oClassNameMap[sKey].replace(/\#/g, nValue)}}`
        );
      }
    }
    // 数值类
    else if (/\d+/.test(item)) {
      let tmp = item.split('-');
      if (tmp.length > 1) {
        let sKey = tmp.slice(0, tmp.length - 1).join('-');
        let nValue = tmp[tmp.length - 1];
        aStyleStr.push(
          `${item}{${oClassNameMap[sKey].replace(/\$/g, nValue)}}`
        );
      }
      // 通用类
    } else {
      let sKey = item;
      aStyleStr.push(`${item}{${oClassNameMap[sKey]}}`);
    }
  });

  return aStyleStr;
}

module.exports = function (sSource) {
  if (!oAtomConfig) {
    // 读取配置文件，如果不存在，就是用默认的配置文件
    try {
      oAtomConfig = require(__dirname + '/../../' + this.query.config);
    } catch (e) {
      oAtomConfig = require(__dirname + '/atomcss.config.js');
    }
    sAtomRegExp = getAtomClassReg();
  }

  // 从文件中提取所有类名
  let sClassString = getAllClassNameFromSource(sSource);

  // 正式生成原子类
  let aStyleStr = generateAtomCss(sClassString);

  return `'' + '${aStyleStr.join('')}'`;
};
