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
        randomNum:_randomNum,
        numToThousandsSeparator:_numToThousandsSeparator
    };

    /**
     * @desc 生成指定范围随机数
     * @param  {Number} min
     * @param  {Number} max
     * @return {Number}
     */
    function _randomNum(min,max) {
        return Math.floor(min + Math.random() * (max - min));
    }

    /**
     * 给数字加千分位显示
     * @param num 需要加千分位的数字
     */
    function _numToThousandsSeparator(num){
        //如果传进来的值不是数字，则原值返回
        if (!Number(num) || num < 1000) {
            return num;
        }
        num = num + "";
        var re = /(-?\d+)(\d{3})/;
        //正则判断
        while (re.test(num)) {
            //符合条件则进行替换
            num = num.replace(re, "$1,$2");
        }
        return num;
    }




    //这里确定了插件的名称
    //this.numberUtils = _numberUtils;
    window.numberUtils = _numberUtils;

}(window,document));