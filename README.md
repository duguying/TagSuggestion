#TagSuggestion

TagSuggestion是“开源中国人才汇”简历部分用到的搜索建议(suggestion)分类列表控件。

## 使用

```javascript
var ele = document.getElementById("tag");
// 创建控件
var tag_sug = new TagSuggestion();
// 绑定输入框
tag_sug.updateBindElement(ele);
// 数据
var new_data = {
    "编程语言":["php","golang","typescript"],
    "Web应用开发":["ssh","cakephp"],
    "移动开发":["iWatch","WP8"],
    "开发工具":["Visual Studio","Notepad++"],
    "数据库":["MariaDB","Oracle","Redis"],
    "开发插件":["Emmet","MyEclipse"]
};
// 绑定数据
tag_sug.updateData(new_data);
```

## License

MIT License
