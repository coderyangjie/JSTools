/**
 * Created by yangjie on 2018/7/20.
 * 日期处理工具类（使用闭包方式开发）
 */

;//JavaScript 弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误，因此在这里加上";"号。
//使用自调用匿名函数封装(防止插件用户定义的函数名与插件名冲突)
(function(window,document){
    //定义一些默认参数
    var _options={
        parameterName:"parameterValue"

    };

    //定义一些API方法
    var _DateUtils = {
        formatDate:_formatDate,
        parseDateString:_parseDateString,
        formatDateToFriendly:_formatDateToFriendly,
        isLeapYear:_isLeapYear,
        getDaysOfMonth:_getDaysOfMonth,
        getDaysOfYear:_getDaysOfYear,
        getFirstDayOfYear:_getFirstDayOfYear,
        getLastDayOfYear:_getLastDayOfYear,
        computeTotalMonths:_computeTotalMonths,
        dateStringToChinese:_dateStringToChinese,
        dateDiff:_dateDiff

    };


    /**
     * 将日期格式化成指定格式的字符串
     * formatDate(date, fmt)，其中fmt支持的格式有：
     * y（年）
     * M（月）
     * d（日）
     * q（季度）
     * w（星期）
     * H（24小时制的小时）
     * h（12小时制的小时）
     * m（分钟）
     * s（秒）
     * S（毫秒）
     * 另外，字符的个数决定输出字符的长度，如，yy输出16，yyyy输出2016，ww输出周五，www输出星期五，等等。
     * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
     * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
     * @returns 返回格式化后的日期字符串
     */
    function _formatDate(date, fmt)
    {
        date = date == undefined ? new Date() : date;
        date = typeof date == 'number' ? new Date(date) : date;
        fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
        var obj =
            {
                'y': date.getFullYear(), // 年份，注意必须用getFullYear
                'M': date.getMonth() + 1, // 月份，注意是从0-11
                'd': date.getDate(), // 日期
                'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                'w': date.getDay(), // 星期，注意是0-6
                'H': date.getHours(), // 24小时制
                'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                'm': date.getMinutes(), // 分钟
                's': date.getSeconds(), // 秒
                'S': date.getMilliseconds() // 毫秒
            };
        var week = ['天', '一', '二', '三', '四', '五', '六'];
        for(var i in obj)
        {
            fmt = fmt.replace(new RegExp(i+'+', 'g'), function(m)
            {
                var val = obj[i] + '';
                if(i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
                for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
                return m.length == 1 ? val : val.substring(val.length - m.length);
            });
        }
        return fmt;
    }

    /**
     * 将字符串解析成日期
     * parseDate(str, fmt)，其中fmt支持的格式有：
     * y（年）
     * M（月）
     * d（日）
     * H（24小时制的小时）
     * h（12小时制的小时）
     * m（分钟）
     * s（秒）
     * S（毫秒）
     * @param str 输入的日期字符串，如'2014-09-13'
     * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
     * @returns 解析后的Date类型日期
     */
    function _parseDateString(str, fmt)
    {
        fmt = fmt || 'yyyy-MM-dd';
        var obj = {y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0};
        fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function(m, $1, $2, $3, $4, idx, old)
        {
            str = str.replace(new RegExp($1+'(\\d{'+$2.length+'})'+$4), function(_m, _$1)
            {
                obj[$3] = parseInt(_$1);
                return '';
            });
            return '';
        });
        obj.M--; // 月份是从0开始的，所以要减去1
        var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
        if(obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
        return date;
    }

    /**
     * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
     * 当天的返回时分，当年的返回月日，否则，返回年月日
     * @param {Object} date
     */
    function _formatDateToFriendly(date)
    {
        date = date || new Date();
        date = typeof date === 'number' ? new Date(date) : date;
        var now = new Date();
        if((now.getTime() - date.getTime()) < 60*1000) return '刚刚'; // 1分钟以内视作“刚刚”
        var temp = this.formatDate(date, 'yyyy年M月d');
        if(temp == this.formatDate(now, 'yyyy年M月d')) return this.formatDate(date, 'HH:mm');
        if(date.getFullYear() == now.getFullYear()) return this.formatDate(date, 'M月d日');
        return temp;
    }

    /**
     * 判断某一年是否是闰年
     * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
     */
    function _isLeapYear(year)
    {
        if(year === undefined) year = new Date();
        if(year instanceof Date) year = year.getFullYear();
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    /**
     * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
     * 方式一：dateUtils.getDaysOfMonth();
     * 方式二：dateUtils.getDaysOfMonth(new Date());
     * 方式三：dateUtils.getDaysOfMonth(2013, 12);
     */
    function _getDaysOfMonth(date, month)
    {
        var y, m;
        if(date == undefined) date = new Date();
        if(date instanceof Date)
        {
            y = date.getFullYear();
            m = date.getMonth();
        }
        else if(typeof date == 'number')
        {
            y = date;
            m = month-1;
        }else if(typeof date == 'String'){
            var strdate = new Date(date);
            y = strdate.getFullYear();
            m = strdate.getMonth();
        }
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 非闰年的一年中每个月份的天数
        //如果是闰年并且是2月
        if(m == 1 && _isLeapYear(y)) return days[m]+1;
        return days[m];
    }

    /**
     * 获取某年有多少天
     * @param date
     * @returns {number}
     * @private
     */
    function _getDaysOfYear(date) {
        var firstDayYear = this._getFirstDayOfYear(date);
        var lastDayYear = this._getLastDayOfYear(date);
        var numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime())/1000;
        return Math.ceil(numSecond/(24*3600));
    }


    /**
     * 获取某年的第一天
     * @param date
     * @returns {string}
     * @private
     */
    function _getFirstDayOfYear(date) {
        var year = new Date(date).getFullYear();
        return year + "-01-01 00:00:00";
    }

    /**
     * 获取某年最后一天
     * @param date
     * @returns {string}
     * @private
     */
    function _getLastDayOfYear(date) {
        var year = new Date(date).getFullYear();
        var dateString = year + "-12-01 00:00:00";
        var endDay = _getDaysOfMonth(dateString);
        return year + "-12-" + endDay + " 23:59:59";
    }

    /**
     *  计算总月数
     * @param beginYear
     * @param beginMonth
     * @param endYear
     * @param endMonth
     * @returns {number|*}
     * @private
     */
    function _computeTotalMonths(beginYear,beginMonth,endYear,endMonth){
        var by=parseInt(beginYear);
        var bm=parseInt(beginMonth);
        var ey=parseInt(endYear);
        var em=parseInt(endMonth);

        var totalMonth=(ey-by)*12+em-bm+1;
        return totalMonth;
    }

    /**
     *  把数字日期如2014-06-21转换为 二零一四年六月二十一日星期三。
     * @param dateStr
     * @returns {string}
     */
    function _dateStringToChinese(dateStr) {

        var dict = {
            "0": "零", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六",
            "7": "七", "8": "八", "9": "九", "10": "十", "11":"十一", "12":"十二", "13":"十三",
            "14":"十四", "15":"十五", "16":"十六", "17":"十七", "18":"十八", "19":"十九",
            "20":"二十", "21":"二十一", "22":"二十二", "23":"二十三", "24":"二十四", "25":"二十五",
            "26":"二十六", "27":"二十七", "28":"二十八", "29":"二十九", "30":"三十", "31":"三十一"
        };
        var date = dateStr.split('-'),
            yy = date[0],
            mm = date[1],
            dd = date[2];

        var yearStr = dict[yy[0]] + dict[yy[1]] + dict[yy[2]] + dict[yy[3]] + '年',
            monthStr = dict[''+Number(mm)] + '月',
            dayStr = dict[dd];

        return yearStr+monthStr+dayStr;
    }


    /**
     * 计算两个日期相差的天数
     * @param sDate1
     * @param sDate2
     * @returns {Number|*}
     * @private
     */
    function  _dateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式
        var  aDate,  oDate1,  oDate2,  iDays;
        aDate  =  sDate1.split("-");
        oDate1  =  new  Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);    //转换为12-18-2002格式
        aDate  =  sDate2.split("-");
        oDate2  =  new  Date(aDate[1] +  '-'  + aDate[2] +  '-' + aDate[0]);
        iDays  =  parseInt(Math.abs(oDate1 - oDate2)/1000/60/60/24);    //把相差的毫秒数转换为天数
        return  iDays;
    }





    //这里确定了插件的名称
    //this.dateUtils = _DateUtils;
    window.dateUtils = _DateUtils;

}(window,document));