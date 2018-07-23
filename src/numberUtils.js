/**
 * 数字处理工具类（使用闭包方式开发）
 * Created by yangjie on 2018/7/23.
 */
;//JavaScript 弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误，因此在这里加上";"号。
//使用自调用匿名函数封装(防止插件用户定义的函数名与插件名冲突)
(function(window,document){


    //定义一些API方法
    var _numberUtils = {
        randomNum:_randomNum,
        numToThousandsSeparator:_numToThousandsSeparator,
        numberToChinese:_numberToChinese,
        chineseToNumber:_chineseToNumber
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

    /**
     * 阿拉伯数字转中文数字的方法
     * 中文数字的特点：
     * •每个计数数字都跟着一个权位，权位有：十、百、千、万、亿。
     * •以“万”为小节，对应一个节权位，万以下没有节权位。
     * •每个小节内部以“十百千”为权位独立计数。
     * •“十百千”不能连续出现，而“万”和“亿”作为节权位时可以和其他权位连用，如：“二十亿”。
     * 中文数字对“零”的使用要满足以下三条规则：
     * •以10000为小节，小节的结尾即使是0，也不使用零。
     * •小节内两个非0数字之间要使用“零”。
     * •当小节的“千”位是0时（即：1~999），只要不是首小节，都要补“零”。
     * 算法设计的一些说明：
     * •对“零”的第三个规则，把检测放在循环的最前面并默认为false，可以自然的丢弃最高小节的加零判断。
     * •单个数字转换用数组实现，var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
     * •节权位同样用数组实现，var chnUnitSection = ["","万","亿","万亿","亿亿"]；
     * •节内权位同样用数组实现，var chnUnitChar = ["","十","百","千"];
     * @param num
     * @returns {*}
     * @constructor
     */

    //定义一些默认参数
    var _options={
        chnNumChar:["零","一","二","三","四","五","六","七","八","九"],
        chnUnitSection:["","万","亿","万亿","亿亿"],
        chnUnitChar:["","十","百","千"]

    };

    function _numberToChinese(num){

        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;
        if(num === 0){
            return _options.chnNumChar[0];
        }
        while(num > 0){
            var section = num % 10000;
            if(needZero){
                chnStr = _options.chnNumChar[0] + chnStr;
            }
            strIns = sectionToChinese(section);
            strIns += (section !== 0) ? _options.chnUnitSection[unitPos] : _options.chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        return chnStr;
    }

    /**
     *  节内转换方法
     * @param section
     * @returns {string}
     * @constructor
     */
    function sectionToChinese(section){
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = _options.chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = _options.chnNumChar[v];
                strIns += _options.chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }


    /**
     * 中文数字转阿拉伯数字
     *  设计思想：
     *  •将中文数学转换成阿拉伯数字。
     *  •将中文权位转换成10的位数。
     *  •对每个权位依次转换成位数并求和。
     *  •零直接忽略即可。
     * @param chnStr
     * @returns {number}
     * @constructor
     */
    function _chineseToNumber(chnStr){
        //中文数字转换成阿拉伯数字用如下对象实现
        var chnNumChar = { 零:0,一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9 };
        //中文权位转换成10的位数及节权标志用如下对象实现
        var chnNameValue = {
            十:{value:10, secUnit:false},
            百:{value:100, secUnit:false},
            千:{value:1000, secUnit:false},
            万:{value:10000, secUnit:true},
            亿:{value:100000000, secUnit:true}
        };
        var rtn = 0;
        var section = 0;
        var number = 0;
        var secUnit = false;
        var str = chnStr.split('');
        for(var i = 0; i < str.length; i++){
            var num = chnNumChar[str[i]];
            if(typeof num !== 'undefined'){
                number = num;
                if(i === str.length - 1){
                    section += number;
                }
            }else{
                var unit = chnNameValue[str[i]].value;
                secUnit = chnNameValue[str[i]].secUnit;
                if(secUnit){
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                }else{
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    }





    //这里确定了插件的名称
    //this.numberUtils = _numberUtils;
    window.numberUtils = _numberUtils;

}(window,document));