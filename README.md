#TagSuggestion

TagSuggestion是“开源中国人才汇”简历部分用到的搜索建议(suggestion)分类列表控件。

## 使用

```javascript
var ele1 = document.getElementsByTagName("input")[0];
var ele2 = document.getElementsByTagName("input")[1];
var tag_sug = new TagSuggestion();
tag_sug.addBindingElement(ele1);
tag_sug.addBindingElement(ele2);

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
