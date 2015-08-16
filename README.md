#TagSuggestion

TagSuggestion是“开源中国人才汇”简历部分用到的搜索建议(suggestion)分类列表控件，控件为单例模式，一次初始化页面到处使用。

## 效果

![demo](https://git.oschina.net/duguying2008/TagSuggestion/raw/master/show.gif?dir=0&filepath=show.gif)

## 使用

```javascript
var ele1 = document.getElementsByTagName("input")[0];
var ele2 = document.getElementsByTagName("input")[1];
var ele3 = document.getElementsByTagName("input")[2];

TagSuggestion.ME.addBindingElement(ele1);
TagSuggestion.ME.addBindingElement(ele2,function(ele){
    // ele 为当前绑定的 input 元素
});
TagSuggestion.ME.addBindingElement(ele3,function(ele, true){
    // ele 为当前绑定的 input 元素
    // 若有第二个参数 true , 则当前回调函数返回 false 时, 可以截断数据对 input 的填充
});

TagSuggestion.ME.removeBindingElement(ele1);

var new_data = {
    "编程语言":["php","golang","typescript"],
    "Web应用开发":["ssh","cakephp"],
    "移动开发":["iWatch","WP8"],
    "开发工具":["Visual Studio","Notepad++"],
    "数据库":["MariaDB","Oracle","Redis"],
    "开发插件":["Emmet","MyEclipse"]
};

tag_sug.updateData(new_data);
```

## License

MIT License
