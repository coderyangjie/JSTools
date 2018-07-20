/**
 * Created by yangjie on 2018/7/19.
 * 字符串处理工具（使用闭包方式开发）
 */

;//JavaScript 弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误，因此在这里加上";"号。
//使用自调用匿名函数封装(防止插件用户定义的函数名与插件名冲突)
(function(window,document){
    //定义一些默认参数
    var _options={
        default_word:"default hello"

    }

    //定义一些API方法
    var _StringUtils = {
        //获取字符串长度：中文为2个英文字符。
        length:function(str){
            var j=0;
            for(var i=0;i<str.length;i++)
            {
                if(str.substr(i,1).charCodeAt(0)>255) j = j + 2;
                else j=j+1;
            }
            return j;
        },
        //去除字符串左边的空格
        leftTrim:function(str){
            return str.replace(/(^\s*)/g, "");
        },
        //去除字符串右边的空格
        rightTrim:function (str) {
            return str.replace(/(\s*$)/g, "");
        },
        //去除字符串前后的空格
        leftAndRightTrim:function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        //去除字符串所有的空格
        trim:function(str){
            return str.replace(/\s|\xA0/g,"");
        },
        //随机生成指定长度的字符串,length 为长度
        randomString:function(length){
            var str = Math.random().toString(36).substr(2);
            if (str.length >= length) {
                return str.substr(0, length);
            }
            str += random(length - str.length);
            return str;
        },
        firstFunc:function(str){
            alert(str);
            return this;//返回当前方法
        },
        secondFunc:function(){
            alert("secondFunc");
            return this;//返回当前方法
        }


    };









    //这里确定了插件的名称
    //this.StringUtils = _StringUtils;
    window.StringUtils = _StringUtils;

    //扩展JavaScript原生String对象的方法
    String.prototype.leftTrim = function()
    {
        return this.replace(/(^\s*)/g, "");
    }

    String.prototype.rightTrim = function()
    {
        return this.replace(/(\s*$)/g, "");
    }

    String.prototype.leftAndRightTrim = function()
    {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }

    String.prototype.trim = function()
    {
        return this.replace(/\s|\xA0/g,"");
    }


}(window,document));


