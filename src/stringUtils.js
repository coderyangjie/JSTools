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
        getLength:function(str){
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
        randomColor:_randomColor,
        leftString:_leftString,
        rightString:_rightString,
        middleString:_middleString,
        isIP:_isIP,
        isMobile:_isMobile,
        isEmail:_isEmail,
        isUrl:_isUrl,
        isIdCard:_isIdCard,
        isNum:_isNum,
        isTelephone:_isTelephone,
        isEnglish:_isEnglish,
        isUpperCase:_isUpperCase,
        isLowerCase:_isLowerCase,
        digitToChineseNum:_digitToChineseNum,
        changeCase:_changeCase,

        firstFunc:function(str){
            alert(str);
            return this;//返回当前方法
        },
        secondFunc:function(){
            alert("secondFunc");
            return this;//返回当前方法
        }


    };


    /**
     * 随机生成颜色六位十六进制颜色值
     * 有的时候我们会看到这样一个场景，在页面点击，会随机改变页面的背景色，让人觉得很炫酷，其实就是随机生成了颜色的效果。
     * 在CSS属性中，表示颜色的color属性一般用"#"加上六位十六进制数表示，
     * 通过Math.random()方法我们同样可以生成一串表示颜色的随机数字，然后前面拼接上"#"，就可以达到上述要求。
     * @returns {string}
     */
    function _randomColor() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    }



    /**
     * 得到指定长度左边的字符串
     * @param str
     * @param len
     * @returns {string}
     * @private
     */
    function _leftString(str,len){
        if(isNaN(len)||len==null)
        {
            len = str.length;
        }
        else
        {
            if(parseInt(len)<0||parseInt(len)>str.length)
            {
                len = str.length;
            }
        }
        return str.substring(0,len);
    }

    /**
     * 得到指定长度右边的字符串
     * @param str
     * @param len
     * @returns {string}
     * @private
     */
    function _rightString(str,len){
        if(isNaN(len)||len==null)
        {
            len = str.length;
        }
        else
        {
            if(parseInt(len)<0||parseInt(len)>str.length)
            {
                len = str.length;
            }
        }
        return str.substring(str.length-len,str.length);
    }

    /**
     * 得到指定开始长度到结束长度之间的字符串,注意从0开始
     * @param str
     * @param start
     * @param len
     * @returns {string}
     * @private
     */
    function _middleString(str,start,len){
        return str.substring(start-1,len);
    }

    /**
     * 判断字符串是否是正确的IP地址
     * @param str
     * @returns {boolean}
     */
    function _isIP(str){
        var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if (reSpaceCheck.test(str)){
            str.match(reSpaceCheck);
            if (RegExp.$1 <= 255 && RegExp.$1 >= 0
                && RegExp.$2 <= 255 && RegExp.$2 >= 0
                && RegExp.$3 <= 255 && RegExp.$3 >= 0
                && RegExp.$4 <= 255 && RegExp.$4 >= 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }else{
            return false;
        }
    }

    /**
     * 判断字符串是否是手机号
     * @param str
     * @returns {boolean}
     */
    function _isMobile(str){
        return /^0{0,1}13[0-9]{9}$/.test(str);
        //return /^1[3|4|5|7|8|9][0-9]{9}$/.test(str);
    }

    /**
     * 判断字符串是否是邮箱
     * @param str
     * @returns {boolean}
     */
    function _isEmail(str){
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(str);
    }

    /**
     * 判断字符串是否是有效链接
     * @param str
     * @returns {boolean}
     */
    function _isUrl(str){
        return /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/i.test(str);
    }

    /**
     * 判断字符串是否为身份证号
     * @param str
     * @returns {boolean}
     */
    function _isIdCard(str) {
        return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
    }

    /**
     * 判断字符串是否为数字
     * @param str
     * @returns {boolean}
     */
    function _isNum(str){
        return /^[0-9]+$/.test(str);
    }

    /**
     * 判断字符串是否为电话
     * mobile和telephone区别：
     * Mobile phone就是移动电话如：手机，小灵通...，简写：M常见于名片；
     * Telephone就是电话，一般指座机，如公司的电话...，简写：T常见于名片
     * @param str
     */
    function _isTelephone(str){
        return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    }

    /**
     * 判断字符串是否为英文字母
     * @param str
     * @returns {boolean}
     */
    function _isEnglish(str){
        return /^[a-zA-Z]+$/.test(str);
    }

    /**
     * 判断字符串是否为大写字母
     * @param str
     * @returns {boolean}
     */
    function _isUpperCase(str){
        return /^[A-Z]+$/.test(str);
    }

    /**
     * 判断字符串是否为小写字母
     * @param str
     * @returns {boolean}
     */
    function _isLowerCase(str){
        return /^[a-z]+$/.test(str);
    }


    /**
     * 数字现金金额转中文大写
     * @param {Number} n
     * @returns {string}
     */
    function _digitToChineseNum(n) {
        var fraction = ['角', '分'];
        var digit = [
            '零', '壹', '贰', '叁', '肆',
            '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整');
    };

    /**
     * 字母大小写切换
     * @param str
     * @param type
     * @returns {*}
     * FirstUpper - 首字母大写
     * FirstLower - 首字母小写
     * AllToggle - 全部大小写转换
     * AllUpper - 全部大写
     * AllLower - 全部小写
     */
    function _changeCase(str, type) {
        /**
         * 大小写相互转换
         * @param str
         * @returns {string}
         * @constructor
         */
        function ToggleCase(str) {
            var itemText = ""
            str.split("").forEach(
                function (item) {
                    if (/^([a-z]+)/.test(item)) {
                        itemText += item.toUpperCase();
                    } else if (/^([A-Z]+)/.test(item)) {
                        itemText += item.toLowerCase();
                    } else {
                        itemText += item;
                    }
                });
            return itemText;
        }

        switch (type) {
            case 'FirstUpper':
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
            case 'FirstLower':
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toLowerCase() + word.substring(1);
                });
            case 'AllToggle':
                return ToggleCase(str);
            case 'AllUpper':
                return str.toUpperCase();
            case 'AllLower':
                return str.toLowerCase();
            default:
                return str;
        }
    }



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

    String.prototype.leftString = function(len)
    {
        if(isNaN(len)||len==null)
        {
            len = this.length;
        }
        else
        {
            if(parseInt(len)<0||parseInt(len)>this.length)
            {
                len = this.length;
            }
        }
        return this.substring(0,len);
    }

    String.prototype.rightString= function(len)
    {
        if(isNaN(len)||len==null)
        {
            len = this.length;
        }
        else
        {
            if(parseInt(len)<0||parseInt(len)>this.length)
            {
                len = this.length;
            }
        }
        return this.substring(this.length-len,this.length);
    }

    String.prototype.middleString = function(start,len)
    {
        return this.substring(start-1,len);
    }

    String.prototype.isIP = function(){
        var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if (reSpaceCheck.test(this)){
            this.match(reSpaceCheck);
            if (RegExp.$1 <= 255 && RegExp.$1 >= 0
                && RegExp.$2 <= 255 && RegExp.$2 >= 0
                && RegExp.$3 <= 255 && RegExp.$3 >= 0
                && RegExp.$4 <= 255 && RegExp.$4 >= 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }else{
            return false;
        }
    }

    String.prototype.isMobile = function(){
        return /^0{0,1}13[0-9]{9}$/.test(this);
    }

    String.prototype.isEmail = function(){
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this);
    }

    String.prototype.isUrl = function(){
        return /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/i.test(this);
    }


}(window,document));


