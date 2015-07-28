# 瀑布流组件

## 特点
- 适用于移动端
- 符合AMD规范，使用require加载

## 用法
1. 模板中，拷贝如下代码，瀑布流包含几列就写几个`<div class="waterfall-col"></div>`。
```html
<div class="waterfall-container clearfix">
    <div class="waterfall-col"></div>
    <div class="waterfall-col"></div>
    <div class="waterfall-col"></div>
    <div class="waterfall-loading"></div>
</div>
```

2. CSS中，规定类名如下，在类名下自定义样式
>瀑布流容器 --> waterfall-container<br>
瀑布流列 --> waterfall-col<br>
瀑布流卡片 --> waterfall-card<br>
卡片中的图片 --> waterfall-img

3. 在模板中引入[RequireJS](http://requirejs.org/docs/release/2.1.11/minified/require.js)，然后把waterfall.js`require`进来，执行`waterfall.init()`。`init`方法可以加入自定义的参数。参数列表如下：
```javascript
// 瀑布流列数
colNum: 3,
// 卡片左右间距
gutterWidth: 10,
// 卡片上下间距
gutterHeight: 10,
// 间隔时间
interval: 500,
// 回调函数列表
callbackList: [loadMore],
// 异步请求相关参数
ajaxConf: {
    method: 'POST',
    url: '',
    // 一次加载多少张卡片
    limit: 30
}
```

## Update 2015-7-28
- 改为优先适配移动端，『加载更多』的启动机制由绑定 scroll 事件改为使用 setInterval，因为在 iOS 下向上滑动不能触发 scroll 事件，首先会触发 touch 事件。
