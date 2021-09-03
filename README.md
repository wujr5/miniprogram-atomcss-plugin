# miniprogram-atomcss-plugin

> https://github.com/wujr5/miniprogram-atomcss-plugin

基于**微信小程序**的**按需**生成**原子类**样式的 webpack 插件。

## 使用

### 安装

> 需使用 webpack 5.x

```
npm i -S miniprogram-atomcss-plugin
npm i -D webpack webpack-cli
```

安装后需要在**微信开发者工具**中[构建npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html#_2-%E6%9E%84%E5%BB%BA-npm)。

### 配置

**webpack配置**

```js
// webpack.config.js
const MiniprogramAtomcssPlugin = require('miniprogram-atomcss-plugin');
const getFiles = MiniprogramAtomcssPlugin.getFiles;

module.exports = {
  mode: 'production',
  entry: () => {
    return getFiles('./pages')
      .filter((item => item.endsWith('.wxml')));
  },
  // 生成的原子类文件位置和文件名，根据需要进行修改
  output: {
    path: __dirname,
    filename: 'atomcss.wxss',
  },
  // loader 读取 wxml 文件生成原子类
  module: {
    rules: [{
      test: /.wxml$/,
      use: [{
        loader: 'miniprogram-atomcss-plugin/loader'
      }]
    }]
  },
  // watch 选项
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    poll: 500
  },
  // 配置原子类生成插件
  plugins: [
    new MiniprogramAtomcssPlugin(),
  ]
};
```

**将生成的原子类wxss文件引入app.wxss中**

```css
@import 'atomcss.wxss';
```

**项目根目录下的：atomcss.config.js**

```js
// atomcss.config.js
module.exports = {
  // 数值原子类配置示例
  '.fsize': 'font-size: $rpx',
  '.bd': 'border: $rpx solid #e1e5ee',

  // 色值原子类配置示例
  '.backcolor': 'background-color: #',

  // 通用原子类配置示例
  '.bgred': 'background: red',

  // ... 你的配置
}
```

**引用通用原子类**

在 `app.wxss` 中引入：

```scss
@import '/miniprogram_npm/miniprogram-atomcss-plugin/atomcss-common.wxss';
```

### 运行

在 `package.json` 中增加脚本指令

```json
// ... 其他配置
"scripts": {
  "dev": "webpack"
}
// ... 其他配置
```

运行命令监听 wxml 文件的变动，并按需生成原子类：

```
npm run dev
```

## 定制原子类

在根目录增加配置文件：`atomcss.config.js`，根据规则定制自己的原子类：

```js
// atomcss.config.js
module.exports = {
  // 数值原子类配置示例
  '.fsize': 'font-size: $rpx',
  '.bd': 'border: $rpx solid #e1e5ee',

  // 色值类原子类配置示例
  '.backcolor': 'background-color: #',

  // 通用原子类配置示例
  '.bgred': 'background: red',

  // ... 你的配置
}
```

**数值原子类定制**

* 包含 `$` 符号，此符号代表属性值中的数字，`vue-atomcss-loader` 会将此替换成类名内的数值
* 使用形式为：`.fsize-100`，数字与主体用 `-` 隔开
* 如：`.fsize: 'font-size: $rpx'`，`.fsize-100`，会生成 css：`.fsize-100{font-size: 100rpx}`

**色值原子类定制**

* 包含 `#` 符号，此符号代表属性值中的色值，只支持十六进制表示的 rgb 色值，`vue-atomcss-loader` 会将此替换成类名内的色值
* 使用形式为：`.backcolor-aa33dd`，色值与主体用 `-` 隔开
* 如：`.backcolor: 'background-color: #'`，`.backcolor-aa33dd`，会生成 css：`.backcolor-aa33dd{background-color: #aa33dd}`

**通用原子类定制**

* 不包含 `$` 和 `#` 符号，使用时类名直接使用，不可包含数字
* 如：`.bgred: 'background: red'`，使用时直接使用：`.bgred`

## 数值原子类

> 属性值具有数字的原子类

### margin、padding、width、height、border-radius

**`margin`对应的缩写：**

* margin: m
* margin-left: ml
* margin-right: mr
* margin-top: mt
* margin-bottom: mb
* margin-left & margin-right: mx
* margin-top & margin-bottom: my

例子：

```html
<!-- wxml -->
<view class="m-10 ml-10 mr-10 mt-10 mb-10 mx-10 my-10"></view>
```

最终会生成如下css：

```css
.m-10{margin: 10rpx}
.ml-10{margin-left: 10rpx}
.mr-10{margin-right: 10rpx}
.mt-10{margin-top:10rpx}
.mb-10{margin-bottom: 10rpx}
.mx-10{margin-left: 10rpx; margin-right: 10rpx}
.my-10{margin-top: 10rpx; margin-bottom: 10rpx}
```

**`padding`对应的缩写：**

* padding: p
* padding-left: pl
* padding-right: pr
* padding-top: pt
* padding-bottom: pb
* padding-left & padding-right: px
* padding-top & padding-bottom: py

例子：

```html
<!-- wxml -->
<view class="p-10 pl-10 pr-10 pt-10 pb-10 px-10 py-10"></view>
```

最终会生成如下css：

```css
.p-10{padding: 10rpx}
.pl-10{padding-left: 10rpx}
.pr-10{padding-right: 10rpx}
.pt-10{padding-top:10rpx}
.pb-10{padding-bottom: 10rpx}
.px-10{padding-left: 10rpx; padding-right: 10rpx}
.py-10{padding-top: 10rpx; padding-bottom: 10rpx}
```

**`width`、`height`、`border-radius`对应的缩写：**

* width: w
* width(%)：wp
* height: h
* height(%)：hp
* border-radius: br

例子：

```html
<!-- wxml -->
<view class="w-100.wp-50.h-100.hp-50.br-50"></view>
```

最终会生成如下css：

```css
.w-100{width: 100rpx}
.wp-50{width: 50%}
.h-100{height: 100rpx}
.hp-50{height: 50%}
.br-50{border-radius: 50rpx}
```

### left、right、top、bottom

对应的缩写：

* left: l
* right: r
* top: t
* bottom: b

例子：

```html
<!-- wxml -->
<view class="l-10.r-10.t-10.b-10"></view>
```

最终会生成如下css：

```css
.l-10{left: 10rpx}
.r-10{right: 10rpx}
.t-10{top: 10rpx}
.b-10{bottom: 10rpx}
```

### line-height、font

对应的缩写：

* line-height: lh
* font-size: fs
* font-weight: fw

> 注意：fw 一般用法是：fw-100、fw-200、fw-300、fw-400、fw-500、fw-600、fw-700、fw-800、fw-900，其他数值不生效

例子：

```html
<!-- wxml -->
<view class="lh-100.fs-40.fw-600"></view>
```

最终会生成如下css：

```css
.lh-100{line-height: 100rpx}
.fs-40{font-size: 40rpx}
.fw-600{font-weight: 600}
```

## 色值原子类

### color、background-color

例子：

```html
<!-- wxml -->
<view class="c-123a6d bgc-00ff00"></view>
```

```css
.c-123a6d{color: #123a6d}
.bgc-00ff00{background-color: #00ff00}
```

## 通用原子类

> 属性值不具有数字的原子类，使用时需要引入：`vue-atomcss-loader/atomcss-commom.scss`

### 水平垂直居中

```css
/* 通用水平垂直居中 */
.vh-parent {
  position: relative;
}
.v {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.h {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.vh {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* 块元素水平居中 */
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
```

### 单行和多行省略

```css
/* 行省略 */
.te-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.te-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/* 支持到： .te-3 ~ .te-10 */
```

### 换行

```css
.word-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}
```

### 禁止事件

```css
.event-disabled {
  pointer-events: none;
}
```

### 背景色

```css
/* 通用背景色 */
.bg-white {
  background-color: white;
}
.bg-yellow {
  background-color: yellow;
}
.bg-blue {
  background-color: blue;
}
.bg-green {
  background-color: green;
}
.bg-red {
  background-color: red;
}
.bg-black {
  background-color: black;
}
/* 图片占位色 */
.bg-image {
  background-color: #E1E3E8;
}
/* 文字占位色 */
.bg-text {
  background-color: #F5F7FA;
}
/* 背景loading图 */
.bg-loading {
  background-image: url('https://tva3.sinaimg.cn/large/ed796d65ly1gtzzp2we99g202p02pmy1.gif');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50rpx;
}
```

### 字体色

```css
/* 通用字体色 */
.c-white {
  color: white;
}
.c-yellow {
  color: yellow;
}
.c-blue {
  color: blue;
}
.c-green {
  color: green;
}
.c-red {
  color: red;
}
.c-black {
  color: black;
}
.c-gray {
  color: gray;
}
```

### 字体位置

```css
.t-c {
  text-align: center;
}
.t-l {
  text-align: left;
}
.t-r {
  text-align: right;
}
```

### display

```css
.dspl-inbl, .inbl {
  display: inline-block;
}
.dspl-bl {
  display: block;
}
```

### vertical-align

```css
.vtal-md {
  vertical-align: middle;
}
.vtal-bt {
  vertical-align: bottom;
}
.vtal-top {
  vertical-align: top;
}
```

### float

```css
.fl-r {
  float: right;
}
.fl-l {
  float: left;
}
```

### 鼠标

```css
.cs-pt {
  cursor: pointer;
}
```

### box-sizing

```css
.bs-ct {
  box-sizing: content-box;
}
.bs-bd {
  box-sizing: border-box;
}
```

### position

```css
.pst-rlt {
  position: relative;
}
.pst-absl {
  position: absolute;
}
.pst-fx {
  position: fixed;
}
```

### overflow

```css
.ovfl-hd {
  overflow: hidden;
}
.ovfl-scroll {
  overflow: scroll;
}
.ovfl-vsb {
  overflow: visible;
}
.ovfl-x-hd {
  overflow-x: hidden;
}
.ovfl-x-scroll {
  overflow-x: scroll;
}
.ovfl-x-auto {
  overflow-x: auto;
}
.ovfl-y-hd {
  overflow-y: hidden;
}
.ovfl-y-scroll {
  overflow-y: scroll;
}
.ovfl-y-auto {
  overflow-y: auto;
}
/* 水平滚动 */
.h-scroll {
  overflow-x: scroll;
  width: 100%;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
```

### border-style

```css
.bd-solid {
  border-style: solid;
}
```

### 清除浮动

```css
.cl-b {
  clear: both;
}
.cl-l {
  clear: left;
}
.cl-r {
  clear: right;
}
```

### 体验优化

> 淡入淡出

```css
.fadein-init {
  opacity: 0;

  -webkit-transition: opacity 0.2s ease-in;
     -moz-transition: opacity 0.2s ease-in;
      -ms-transition: opacity 0.2s ease-in;
       -o-transition: opacity 0.2s ease-in;
          transition: opacity 0.2s ease-in;
}

.fadein {
  opacity: 1;
}
```
