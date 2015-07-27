# 瀑布流组件

## 特点
- 使用React实现瀑布流组件

## 用法
```javascript
React.render(
    <Waterfall colNum={3}
                url="/bdbox/hot"
                limit={20}
                gutterWidth={1}
                gutterHeight={1}
    />,
    document.getElementsByClassName('content')[0]
);
```
