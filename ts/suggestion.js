/**
 * Created by rex on 2015/7/28.
 */
var TagSuggestion = (function () {
    function TagSuggestion() {
        this.data = {};
        this.map = {};
        this.bind_elements = [];
        this.callback_fater_input = null;
        this.drawFrame();
        this.drawSpan();
        //console.log(this.map);
        //console.log(this.data);
        //this.activeTab(this.getFirstTabName());
        //this.getBindElementStyle();
    }
    /**
     * 添加类
     * @param dom
     * @param className
     */
    TagSuggestion.prototype.addClass = function (dom, className) {
        var old_class_name = dom.className;
        var new_class_name;
        var arr = old_class_name.split(/ +/);
        new_class_name = "";
        arr.push(className);
        for (var idx in arr) {
            var ele = arr[idx];
            if (ele != "") {
                new_class_name = new_class_name + ele + " ";
            }
        }
        new_class_name = new_class_name.trim();
        dom.className = new_class_name;
    };
    /**
     * 移除类
     * @param dom
     * @param className
     */
    TagSuggestion.prototype.removeClass = function (dom, className) {
        var old_class_name = dom.className;
        var new_class_name = "";
        var arr = old_class_name.split(/ +/);
        for (var idx in arr) {
            var ele = arr[idx];
            if (ele != className && ele != "") {
                new_class_name = new_class_name + ele + " ";
            }
        }
        //console.log(new_class_name);
        new_class_name = new_class_name.trim();
        dom.className = new_class_name;
    };
    /**
     * html转码
     * @param str
     * @returns {string}
     */
    TagSuggestion.prototype.htmlEncode = function (str) {
        var s = "";
        if (str.length == 0)
            return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        return s;
    };
    /**
     * 删除子节点
     * @param div
     */
    TagSuggestion.prototype.removeAllChild = function (ele) {
        while (ele.hasChildNodes()) {
            ele.removeChild(ele.firstChild);
        }
    };
    /**
     * 更新绑定元素
     * @param ele 绑定的input元素
     * @param callback 填充完毕后的回调函数
     */
    TagSuggestion.prototype.addBindingElement = function (ele, callback) {
        this.bind_elements.push({ "element": ele, "callback": callback });
        this.bindInputFocus();
    };
    TagSuggestion.prototype.createBoxDiv = function () {
        this.box_div = document.createElement("div");
        this.addClass(this.box_div, "sug-box");
        this.ul = document.createElement("ul");
        this.box_div.appendChild(this.ul);
        this.box_div.style.display = "none";
    };
    TagSuggestion.prototype.createParentGroupLi = function () {
        this.parent_group_li = document.createElement("li");
        this.addClass(this.parent_group_li, "tab");
        var _this = this;
        // 从li事件委托到span
        this.parent_group_li.addEventListener("mouseover", function (e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if (target.nodeName.toLowerCase() == "span") {
                var key = target.innerHTML;
                _this.activeTab(key);
            }
        });
    };
    TagSuggestion.prototype.createGroupItemLi = function () {
        this.group_item_li = document.createElement("li");
        this.addClass(this.group_item_li, "tab-sub");
        var _this = this;
        // 从li事件委托到span
        this.group_item_li.addEventListener("click", function (e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if (target.nodeName.toLowerCase() == "span") {
                var key = target.innerHTML;
                //console.log(key);
                _this.fillIntoInput(key);
            }
        });
    };
    TagSuggestion.prototype.createItemSpan = function (className, name) {
        var ele;
        ele = document.createElement("span");
        this.addClass(ele, className);
        ele.innerHTML = this.htmlEncode(name);
        return ele;
    };
    /** start drawing **/
    TagSuggestion.prototype.drawFrame = function () {
        this.createBoxDiv();
        this.createGroupItemLi();
        this.createParentGroupLi();
        this.ul.appendChild(this.parent_group_li);
        this.ul.appendChild(this.group_item_li);
        document.body.appendChild(this.box_div);
    };
    TagSuggestion.prototype.drawSpan = function () {
        for (var parent in this.data) {
            var parent_ele = this.createItemSpan("sug-parent", parent);
            this.map[parent] = parent_ele;
            this.parent_group_li.appendChild(parent_ele);
            for (var idx in this.data[parent]) {
                var item = this.data[parent][idx];
                var ele = this.createItemSpan("sug-item", item);
                this.map[parent + idx] = ele;
            }
        }
        ;
        this.activeTab(this.getFirstTabName());
    };
    /**
     * 激活某tab
     * @param key
     */
    TagSuggestion.prototype.activeTab = function (key) {
        for (var tagName in this.data) {
            this.removeClass(this.map[tagName], "active");
            if (key == tagName) {
                this.addClass(this.map[tagName], "active");
            }
        }
        this.removeAllChild(this.group_item_li);
        var group = this.data[key];
        for (var idx in group) {
            this.group_item_li.appendChild(this.map[key + idx]);
        }
    };
    /**
     * 获取当前激活的tab
     * @returns {string}
     */
    TagSuggestion.prototype.getActiveTabName = function () {
        var first_ele_name = "";
        for (var eleName in this.data) {
            if (first_ele_name.length <= 0) {
                first_ele_name = eleName;
            }
            var class_name = this.map[eleName].className;
            if (class_name.indexOf("active") > 0) {
                return eleName;
            }
            ;
        }
        ;
        return first_ele_name;
    };
    /**
     * 获取data中第一个key
     * @returns {string}
     */
    TagSuggestion.prototype.getFirstTabName = function () {
        for (var eleName in this.data) {
            return eleName;
        }
    };
    TagSuggestion.prototype.fillIntoInput = function (content) {
        this.current_bind_element.value = content;
        for (var idx in this.bind_elements) {
            if (this.bind_elements[idx]["element"] == this.current_bind_element) {
                if (this.bind_elements[idx]["callback"]) {
                    this.bind_elements[idx]["callback"]();
                }
            }
            ;
        }
    };
    /**
     * 添加填充后的回调
     * @param callback
     */
    //public addCallbackAfterFill(callback:any){
    //    this.callback_fater_input = callback;
    //}
    /**
     * 更新数据源
     * @param data
     */
    TagSuggestion.prototype.updateData = function (data) {
        this.data = data;
        this.map = {};
        this.removeAllChild(this.parent_group_li);
        this.drawSpan();
        var active_tab = this.getActiveTabName();
        this.activeTab(active_tab);
    };
    TagSuggestion.prototype.hideSugDiv = function () {
        this.box_div.style.display = "none";
    };
    TagSuggestion.prototype.showSugDiv = function () {
        var left = this.current_bind_element.offsetLeft;
        var top = this.current_bind_element.offsetTop;
        var height = this.current_bind_element.offsetHeight;
        var box_top = top + height;
        this.box_div.style.position = "fixed";
        this.box_div.style.left = left + "px";
        this.box_div.style.top = box_top + "px";
        this.box_div.style.display = "";
    };
    TagSuggestion.prototype.bindInputFocus = function () {
        var _this = this;
        if (this.bind_elements.length <= 0) {
            throw new Error("请先绑定input输入框");
        }
        for (var idx in this.bind_elements) {
            this.bind_elements[idx]["element"].addEventListener("focus", function (e) {
                _this.current_bind_element = this;
                _this.showSugDiv();
            });
        }
        document.body.addEventListener("click", function (e) {
            var target = e.target;
            if ((target == _this.current_bind_element) || (target == _this.box_div)) {
            }
            else {
                _this.hideSugDiv();
            }
        });
    };
    return TagSuggestion;
})();
//# sourceMappingURL=suggestion.js.map