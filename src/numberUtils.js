/**
 * 数字处理工具类（使用闭包方式开发）
 * Created by yangjie on 2018/7/23.
 */
;//JavaScript 弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误，因此在这里加上";"号。
//使用自调用匿名函数封装(防止插件用户定义的函数名与插件名冲突)
(function(window,document){
    //定义一些默认参数
    var _options={
        parameterName:"parameterValue"

    };

    //定义一些API方法
    var _numberUtils = {

    };





    //这里确定了插件的名称
    //this.numberUtils = _numberUtils;
    window.numberUtils = _numberUtils;

}(window,document));