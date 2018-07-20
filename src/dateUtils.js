/**
 * Created by yangjie on 2018/7/20.
 * 日期处理工具类（使用闭包方式开发）
 */

;//JavaScript 弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误，因此在这里加上";"号。
//使用自调用匿名函数封装(防止插件用户定义的函数名与插件名冲突)
(function(window,document){
    //定义一些默认参数
    var _options={
        default_word:"default hello"

    };

    //定义一些API方法
    var _DateUtils = {

    };

    //这里确定了插件的名称
    //this.dateUtils = _DateUtils;
    window.dateUtils = _DateUtils;

}(window,document));