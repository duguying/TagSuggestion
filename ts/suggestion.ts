/**
 * Created by rex on 2015/7/28.
 */

class TagSuggestion{
    constructor(){
        this.drawFrame();
        this.drawSpan();
    }

    private box_div:any;
    private ul:any;
    private parent_group_li:any;
    private group_item_li:any;
    private data:any = {};
    private map:any = {};
    private current_bind_element:any;
    private bind_elements:any = [];
    public static ME:TagSuggestion = new TagSuggestion();

    /**
     * 添加类
     * @param dom
     * @param className
     */
    private addClass(dom:any, className:string){
        var old_class_name = dom.className;
        var new_class_name:string;
        var arr = old_class_name.split(/ +/);
        new_class_name = "";
        arr.push(className);
        for(var idx in arr){
            var ele = arr[idx];
            if(ele != ""){
                new_class_name = new_class_name + ele + " ";
            }
        }
        new_class_name = new_class_name.trim();
        dom.className = new_class_name
    }

    /**
     * 移除类
     * @param dom
     * @param className
     */
    private removeClass(dom:any, className:string){
        var old_class_name = dom.className;
        var new_class_name:string = "";
        var arr = old_class_name.split(/ +/);

        for(var idx in arr){
            var ele = arr[idx];
            if(ele != className && ele != ""){
                new_class_name = new_class_name + ele + " ";
            }
        }
        //console.log(new_class_name);
        new_class_name = new_class_name.trim();
        dom.className = new_class_name
    }

    /**
     * html转码
     * @param str
     * @returns {string}
     */
    private htmlEncode(str){
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        return s;
    }

    /**
     * 删除子节点
     * @param div
     */
    private removeAllChild(ele:any){
        while(ele.hasChildNodes()){
            ele.removeChild(ele.firstChild);
        }
    }

    /**
     * 更新绑定元素
     * @param ele 绑定的input元素
     * @param callback 填充完毕后的回调函数
     */
    public addBindingElement(ele:any, callback: any){
        this.bind_elements.push({"element":ele,"callback":callback});
        this.bindInputFocus(ele);
    }

    /**
     * 移除绑定
     * @param ele
     */
    public removeBindingElement(ele:any){
        var idx;
        for (idx in this.bind_elements){
            if(this.bind_elements[idx]["element"] == ele){
                this.bind_elements[idx]["callback"] = null;
                ele.removeEventListener("focus",this.bind_elements[idx]["focus"]);
                delete this.bind_elements[idx];
            };
        }
    }

    private createBoxDiv(){
        this.box_div = document.createElement("div");
        this.addClass(this.box_div, "sug-box");
        this.ul = document.createElement("ul");
        this.box_div.appendChild(this.ul);
        this.box_div.style.display = "none";
    }

    private createParentGroupLi(){
        this.parent_group_li = document.createElement("li");
        this.addClass(this.parent_group_li, "tab");
        var _this = this;
        // 从li事件委托到span
        this.parent_group_li.addEventListener("mouseover", function (e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if(target.nodeName.toLowerCase() == "span"){
                var key = target.innerHTML;
                _this.activeTab(key);
            }
        });
    }

    private createGroupItemLi(){
        this.group_item_li = document.createElement("li");
        this.addClass(this.group_item_li, "tab-sub");
        var _this = this;
        // 从li事件委托到span
        this.group_item_li.addEventListener("click", function (e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if(target.nodeName.toLowerCase() == "span"){
                var key = target.innerHTML;
                //console.log(key);
                _this.fillIntoInput(key);
            }
        });
    }

    private createItemSpan(className:string, name:string){
        var ele:any;
        ele = document.createElement("span");
        this.addClass(ele, className);
        ele.innerHTML = this.htmlEncode(name);
        return ele;
    }

    /** start drawing **/
    private drawFrame(){
        this.createBoxDiv();
        this.createGroupItemLi();
        this.createParentGroupLi();

        this.ul.appendChild(this.parent_group_li);
        this.ul.appendChild(this.group_item_li);

        document.body.appendChild(this.box_div);
    }

    private drawSpan(){
        for(var parent in this.data){
            var parent_ele = this.createItemSpan("sug-parent",parent);
            parent_ele.style.overflow = "hidden";
            parent_ele.setAttribute("title",parent);
            this.map[parent] = parent_ele;
            this.parent_group_li.appendChild(parent_ele);
            for(var idx in this.data[parent]){
                var item = this.data[parent][idx];
                var ele = this.createItemSpan("sug-item",item);
                ele.style.overflow = "hidden";
                ele.setAttribute("title",item);
                this.map[parent+idx] = ele;
            }
        };

        this.activeTab(this.getFirstTabName());
    }

    /**
     * 激活某tab
     * @param key
     */
    private activeTab(key:string){
        for(var tagName in this.data){
            this.removeClass(this.map[tagName],"active");
            if(key == tagName){
                this.addClass(this.map[tagName],"active");
            }
        }

        this.removeAllChild(this.group_item_li);
        var group = this.data[key];
        for(var idx in group){
            this.group_item_li.appendChild(this.map[key+idx]);
        }
    }

    /**
     * 获取当前激活的tab
     * @returns {string}
     */
    private getActiveTabName(){
        var first_ele_name:string = ""
        for(var eleName in this.data){
            if(first_ele_name.length<=0){
                first_ele_name = eleName;
            }
            var class_name = this.map[eleName].className;
            if(class_name.indexOf("active")>0){
                return eleName;
            };
        };
        return first_ele_name;
    }

    /**
     * 获取data中第一个key
     * @returns {string}
     */
    private getFirstTabName(){
        for(var eleName in this.data){
            return eleName;
        }
    }

    /**
     * 获取第一个非空key
     * @returns {string}
     */
    private getFirstNotNullTabName(){
        for(var eleName in this.data){
            if(this.data[eleName]){
                if(this.data[eleName].length != 0){
                    return eleName;
                };
            }
        }
        return this.getFirstTabName();
    }

    private fillIntoInput(content:string){
        this.current_bind_element.value = content;
        for(var idx in this.bind_elements){
            if(this.bind_elements[idx]["element"] == this.current_bind_element){
                if(this.bind_elements[idx]["callback"]){
                    this.bind_elements[idx]["callback"]();
                }
            };
        }
    }

    /**
     * 更新数据源
     * @param data
     */
    public updateData(data:any){
        this.data = data;
        this.map = {};
        this.removeAllChild(this.parent_group_li);
        this.drawSpan();
        var active_tab = this.getActiveTabName();
        if(data[active_tab].length<=0){
            active_tab = this.getFirstNotNullTabName();
        }
        this.activeTab(active_tab);
    }

    private hideSugDiv(){
        this.box_div.style.display = "none";
    }

    private getElementLeft(element){
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }
    private getElementTop(element){
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null){
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }

    private showSugDiv(){
        var left = this.getElementLeft(this.current_bind_element);
        var top = this.getElementTop(this.current_bind_element);
        var height = this.current_bind_element.offsetHeight;
        var box_top = top + height;
        this.box_div.style.position = "absolute";
        this.box_div.style.left = left+"px";
        this.box_div.style.top = box_top+"px";
        this.box_div.style.display = "";
    }

    private bindInputFocus(ele:any){
        var _this = this;
        if(this.bind_elements.length <= 0){
            throw new Error("请先绑定input输入框");
        }

        for(var idx in this.bind_elements){
            if(this.bind_elements[idx]["element"] == ele){
                this.bind_elements[idx]["focus"] = function (e) {
                    _this.current_bind_element = e.target;
                    _this.showSugDiv();
                }
                this.bind_elements[idx]["element"].addEventListener("focus", this.bind_elements[idx]["focus"]);
            }
        }

        document.body.addEventListener("click", function (e) {
            var target = e.target;
            if((target==_this.current_bind_element) || (target==_this.box_div)){
                //console.log("trigger")
            }else{
                _this.hideSugDiv();
            }
        });
    }

}

