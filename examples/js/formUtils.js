/**
 * Created by yangjie on 2018/8/29.
 * form表单处理工具类（使用闭包方式开发）
 */
(function(window,document){
    //定义一些默认参数
    var _options={
        parameterName:"parameterValue"

    };

    //定义一些API方法
    var _FormUtils = {
        isSubmit:_isSubmit,
        serializeJson:_serializeJson


    };

    /**
     * 功能：根据自定义属性校验Form表单
     * 校验From表单说明：
     * 1、给form表单元素加上自定义的属性才会进行表单校验。
     * 2、每个表单元素自定义的属性包括：
     *  diy：表单元素校验不通过时的自定义的提示语，有此属性，则显示自定义提示语，否则显示默认：字段名称+“不能为空,带*为必填项！”；
     *  zdmc：字段名称，用于默认提示语；
     *  zdlx：字段类型。字段类型的值包括：varchar，bigint，int,float，email，date
     *  isnull：判断字段是否可以为空 （0 不能为空 1 可以为空）。
     *  maxLength：限制输入字符串的最大长度。当zdlx为varchar时使用。
     *  iszw：是否判断中文。暂无此校验。
     *  isjczf：是否检测非法字符。(1 需要检测字符，且不可为非法字符；0 不需要检测字符，可以为非法字符)
     *  maxvalue：设置数字类型的最大值。当字段类型为bigint，int,float有效。
     *  minvalue：设置数字类型最小值。当字段类型为bigint，int,float有效。
     * @param strformid  表单id
     * @returns {boolean} 如果返回true则校验成功，否则失败
     */
    function _isSubmit(strformid)
    {
        var DEBUG = false;
        //得到表单对象
        var obj=document.getElementById(strformid);
        var elm,elmtype,elmname,elmvalue,elmtag;
        var elmdiy,elmzdlx,elmisnull,elmzdmc,elmmaxvalue,elmminvalue,elmmaxLength,elmiszw,elmisjczf;
        //循环表单对象中的元素做校验
        for (var i=0; i< obj.elements.length;i++)
        {
            elm=obj.elements[i];   //表单元素对象
            elmtype=elm.type;            //表单中INPUT元素的类型
            elmname =elm.name;           //元素名称
            elmvalue=elm.value;          //元属的值
            elmtag=elm.tagName;         //得到元素的标记名称

            //********取自定义属性***********
            //IE浏览器可通过下面的方法直接取之定义属性的值，但是谷歌和火狐浏览器不行。
            /*         elmdiy = elm.diy;					//自定义提示语句
             elmzdlx= elm.zdlx;         //得到字段类型
             elmisnull=elm.isnull;     //判断字段是否可以为空 （0 不能为空 1 可以为空）
             elmzdmc=elm.zdmc;//  得到字段中文名称
             elmmaxvalue=elm.maxvalue;//得到数字类型最大值（可选）
             elmminvalue=elm.minvalue;//得到数字类型最小值 （可选）
             elmmaxLength=elm.maxLength;
             elmiszw=elm.iszw ; //得到是否判断中文,暂无此校验
             elmisjczf=elm.isjczf ;//得到是否判断非法字符(1 需要检测字符，且不可为非法字符；0 不需要检测字符，可以为非法字符),jczf检测字符*/

            //各个主流浏览器通用取法
            elmdiy = elm.getAttribute("diy");					//自定义提示语句
            elmzdlx= elm.getAttribute("zdlx");         //得到字段类型
            elmisnull=elm.getAttribute("isnull");     //判断字段是否可以为空 （0 不能为空 1 可以为空）
            elmzdmc=elm.getAttribute("zdmc");//  得到字段中文名称
            elmmaxvalue=elm.getAttribute("maxvalue");//得到数字类型最大值（可选）
            elmminvalue=elm.getAttribute("minvalue");//得到数字类型最小值 （可选）
            elmmaxLength=elm.getAttribute("maxLength");
            elmiszw=elm.getAttribute("iszw"); //得到是否判断中文,暂无此校验
            elmisjczf=elm.getAttribute("isjczf");//得到是否判断非法字符(1 需要检测字符，且不可为非法字符；0 不需要检测字符，可以为非法字符),jczf检测字符
            //****************************************

            //如果是 button，reset ，submit，fileUpload 元素退出循环
            if((elmtag=="INPUT" && elmtype=="button")|| elmtype=="reset"|| elmtype=="submit"|| elmtype=="fileUpload" || elmtype == "hidden")
            {
                continue;
            }

            //判断元素的标记名称
            switch(elmtag)
            {
                case "INPUT": //如果是INPUT标记
                    if(DEBUG){alert("field is input,field name: " + elm.name);}
                    //判断元素的类型
                    switch(elmtype)
                    {
                        case "text":
                            if(DEBUG){alert("field's input type is text,field name: " + elm.name);}
                            //判断字段是否为空（0 不能为空;1 可以为空 ）
                            if (elmisnull=="0" && isCheckNull(elmvalue))
                            {
                                if(DEBUG){alert("field is not null,field name: " + elm.name + "\n field value: " + elm.value);}
                                if(elmdiy != "" && elmdiy != null )
                                {
                                    alert(elmdiy);
                                }
                                else
                                {
                                    alert(elmzdmc+"不能为空,带*为必填项！");
                                }
                                elm.focus();
                                return false;
                            }
                            if (elmzdlx=="varchar")
                            {
                                if (is_maxleng(elmvalue,elmmaxLength)==1)
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        var tempMaxLength = parseInt(elmmaxLength/2);
                                        alert(elmzdmc+"输入字符超过定义长度！只能录入"+ elmmaxLength +"个字符，即"+ tempMaxLength +"个汉字！")
                                    }
                                    elm.focus();
                                    return false;
                                }
                                if(elmisjczf == "1")//检测非法字符
                                {
                                    if(isCheckFfzf(elmvalue))
                                    {
                                        if(elmdiy != "" && elmdiy != null )
                                        {
                                            alert(elmdiy);
                                        }
                                        else
                                        {
                                            alert(elmzdmc + "不能包含' \" < > @ # $ ! ~ % ^ & + * ? | \\ /字符！");
                                        }
                                        elm.focus();
                                        return false;
                                    }
                                }
                            }

                            //如果类型为整型或浮点型 判断是否超过最大或最小值
                            if (elmzdlx=="bigint"||elmzdlx=="int"||elmzdlx=="float")
                            {
                                //判断是否是数字
                                if((elmzdlx=="bigint"||elmzdlx=="int") && !isCheckNull(elmvalue))
                                {
                                    if(elmvalue.indexOf(".")>0)
                                    {
                                        alert("录入错误:"+elmzdmc+"的值必须为整数!");
                                        elm.value="";
                                        elm.focus();
                                        return false;
                                    }
                                    var tempint = parseInt(elmvalue);
                                    if(isNaN(tempint) && !isCheckNull(elmvalue))
                                    {
                                        alert("录入错误:"+elmzdmc+"的值必须为数字!");
                                        elm.value="";
                                        elm.focus();
                                        return false;
                                    }
                                    else if(tempint<1)
                                    {
                                        alert("录入错误:"+elmzdmc+"必须是大于0的数字!");
                                        elm.value="";
                                        elm.focus();
                                        return false;
                                    }
                                }
                                //判断是否超过最小值
                                if(elmminvalue!="" && parseFloat(elmvalue) < elmminvalue)
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert(elmzdmc+"输入的值不能小于"+elmminvalue);
                                    }
                                    elm.value="";
                                    elm.focus();
                                    return false;
                                }
                                //判断是否超过最大值
                                if(elmmaxvalue!="" && parseFloat(elmvalue) > elmmaxvalue)
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert(elmzdmc+"输入的值不能大于"+elmmaxvalue);
                                    }
                                    elm.value="";
                                    elm.focus();
                                    return false;
                                }
                            }

                            if(elmzdlx=="email")
                            {
                                //判断字段是否为空（0 不能为空  1 可以为空 ）
                                if (elmisnull=="0" && isCheckNull(elmvalue))
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert(elmzdmc+"不能为空,带*为必填项！");
                                    }
                                    elm.focus();
                                    return false;
                                }
                                else
                                {
                                    if (!isCheckEmail(elmvalue) && elmisnull=="0")
                                    {
                                        if(elmdiy != "" && elmdiy != null )
                                        {
                                            alert(elmdiy);
                                        }
                                        else
                                        {
                                            alert(elmzdmc+"必须是电子邮件格式，如XXX@XXX.XXX！");
                                        }
                                        elm.focus();
                                        return false;
                                    }
                                }
                            }

                            if (elmzdlx=="date")
                            {
                                if (is_maxleng(elmvalue,elmmaxLength)==1)
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert(elmzdmc+"输入字符超过定义长度！")
                                    }
                                    elm.focus();
                                    return false;
                                }
                                if(elmisjczf == "1")//检测非法字符
                                {
                                    if(isCheckFfzf(elmvalue))
                                    {
                                        if(elmdiy != "" && elmdiy != null )
                                        {
                                            alert(elmdiy);
                                        }
                                        else
                                        {
                                            alert(elmzdmc + "不能包含' \" < > @ # $ ! ~ % ^ & + * ? | \\ /字符！");
                                        }
                                        elm.focus();
                                        return false;
                                    }
                                }
                                if(checkDate(elmvalue)=="0"){
                                    alert("日期格式有误！");
                                    elm.focus();
                                    return false;
                                }
                            }
                            break;

                        case "password":

                            //判断字段是否为空（0 不能为空  1 可以为空 ）
                            if (elmisnull=="0" && isCheckNull(elmvalue))
                            {
                                if(elmdiy != "" && elmdiy != null )
                                {
                                    alert(elmdiy);
                                }
                                else
                                {
                                    alert(elmzdmc+"不能为空,带*为必填项！");
                                }
                                elm.focus();
                                return false;
                            }
                            var tempPass = obj.elements[elm.name];
                            if(DEBUG){alert("password length: " + tempPass.length);}

                            if((tempPass.length==2)&&(elmvalue == tempPass[1].value))
                            {
                                if(tempPass[0].value != tempPass[1].value)
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert("两次输入的密码不一致");
                                    }
                                    elm.focus();
                                    return false;
                                }
                            }
                            if(elmisjczf == "1")//检测非法字符
                            {
                                if(isCheckFfzf(elmvalue))
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert(elmzdmc + "不能包含' \" < > @ # $ ! ~ % ^ & + * ? | \\ /字符！");
                                    }
                                    elm.focus();
                                    return false;
                                }
                            }
                            break;

                        case  "textarea":
                            //判断字段是否为空（0 不能为空  1 可以为空 ）
                            if (elmisnull=="0" && isCheckNull(elmvalue))
                            {
                                if(elmdiy != "" && elmdiy != null )
                                {
                                    alert(elmdiy);
                                }
                                else
                                {
                                    alert(elmzdmc+"不能为空,带*为必填项！");
                                }
                                elm.focus();
                                return false;
                            }
                            break;

                        case "radio":
                            if( elmisnull=="0" )
                            {
                                //判断是否选择
                                var ratemp = obj.elements[elm.name];
                                if(DEBUG){alert("run swith case radio: " + elm.value);}
                                if(DEBUG){alert("run swith case radio");}

                                var isRt = 1;
                                var tempI = 0;
                                for(var j=0; j<ratemp.length; j++)
                                {
                                    if(DEBUG){alert("radio: " + j + ":" + ratemp[j].checked);}
                                    if(ratemp[j].checked)
                                    {
                                        isRt = 0;
                                        tempI = j;
                                    }
                                }

                                if(isRt)
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert("请选择" + elmzdmc + "！");
                                    }
                                    ratemp[tempI].focus();
                                    return false;
                                }
                            }
                            break;

                        case "checkbox":
                            if( elmisnull=="0" )
                            {
                                //判断是否选择
                                var ratemp = obj.elements[elm.name];
                                if(DEBUG){alert("run swith case checkbox: " + elm.value);}
                                if(DEBUG){alert("run swith case checkbox");}

                                var isRt = 1;
                                var tempI = 0;
                                for(j=0; j<ratemp.length; j++)
                                {
                                    if(DEBUG){alert("radio: " + j + ":" + ratemp[j].checked);}
                                    if(ratemp[j].checked)
                                    {
                                        isRt = 0;
                                        tempI = j;
                                    }
                                }

                                if(isRt)
                                {
                                    if(elmdiy != "" && elmdiy != null )
                                    {
                                        alert(elmdiy);
                                    }
                                    else
                                    {
                                        alert("请选择" + elmzdmc + "！");
                                    }
                                    ratemp[0].focus();
                                    return false;
                                }
                            }
                            break;
                    }
                    break;

                case "SELECT":
                    //判断字段是否为空（0 不能为空  1 可以为空 ）
                    if (elmisnull=="0" && isCheckNull(elmvalue))
                    {
                        if(elmdiy != "" && elmdiy != null )
                        {
                            alert(elmdiy);
                        }
                        else
                        {
                            alert(elmzdmc+"不能为空,带*为必填项！");
                        }
                        elm.focus();
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    /**
     * 检测输入内容是否为空
     * @param v 字段值
     * @returns {boolean} 如果字段为空则返回true.否则返回false
     */
    function isCheckNull(v)
    {
        var isBe = false;
        if(v == 0 && trim(v)=="")
        {
            isBe = true;
        }
        return isBe;
    }

    /**
     * 去掉字符串前后空格
     * @param p
     * @returns {string|void|XML}
     */
    function trim(p)
    {
        return p.replace(/(^\s*)|(\s*$)/g,"");
    }

    /**
     * 判断是否超过字符的总长度
     * @param value 字符串的值
     * @param length 最大长度
     * @returns {number} 如果超过返回1，否则返回0
     */
    function  is_maxleng(value,length)
    {
        var k=0;
        for (var i=0;i <value.length;i++)
        {
            if(value.substr(i,i+1).charCodeAt(0) > 255) //判断字符串中是否有中文字符
            {
                k=k+2;
            }else{
                k=k+1;
            }
        }
        if (k>length){//如果超过返回1
            return 1;
        }else{
            return 0;
        }
    }

    /**
     * 检测输入内容是否为非法字符
     * @param v 字段值
     * @returns {boolean} 如果输入内容包含' " < > @ # $ ! ~ % ^ & + * ( ) ? | \ /等非法字符则返回true,否则返回false;
     */
    function isCheckFfzf(v)
    {
        var isBe = false;
        if(v.indexOf("'")!=-1 || v.indexOf('"')!=-1 || v.indexOf("<")!=-1 || v.indexOf(">")!=-1 || v.indexOf("!")!=-1 || v.indexOf("@")!=-1 || v.indexOf("#")!=-1 || v.indexOf("$")!=-1 || v.indexOf("%")!=-1 || v.indexOf("^")!=-1 || v.indexOf("&")!=-1 || v.indexOf("*")!=-1 || v.indexOf("?")!=-1 || v.indexOf("/")!=-1 || v.indexOf("\\")!=-1 || v.indexOf("|")!=-1 || v.indexOf("+")!=-1)
        {
            isBe = true;
        }
        return isBe;
    }

    /**
     * 检测输入内容是否为电子邮件格式
     * @param v 字段值
     * @returns {boolean} 如果是则返回true,否则返回false
     */
    function isCheckEmail(v)
    {
        var isBe = true;
        var p = v.indexOf('@');
        var d = v.indexOf('.');
        if (p<1 || p==(trim(v).length-1) || d<1 || d==(trim(v).length-1) || d!=(trim(v).length-4)){
            if (p<1 || p==(trim(v).length-1) || d<1 || d==(trim(v).length-1))
            {
                isBe = false;
            }
        }

        return isBe;
    }

    /**
     * 判断输入内容是否是合法日期
     * @param p 字段值
     * @returns {number} 如果是合法日期返回1，不合法返回0
     */
    function checkDate(p) {
        /**1) 如果strPara=null（或=””(不压缩)），则返回1；*/
        /**2) 是合法返回1，不合法返回0; */
        /**3) 注意：在JAVA中"0000-00-00" 也算合法; */
        if (p==null)	return 1;
        if (p=="")	return 1;
        var intJh=0;//减号个数
        for(var i=0;i<p.length;i++) {
            if (p.charAt(i)=="-") {
                if ((i==0) || (i==p.length-1)){
                    alert("请输入正确的日期格式,如2005-08-09");
                    return 0;//首尾为"-"，也非法
                }
                if (p.charAt(i-1)=="-"){
                    alert("请输入正确的日期格式,如2005-08-09");
                    return 0;//连续两个"-"，也非法
                }
                if (intJh<2) {
                    intJh++;
                    continue;
                }
                alert("请输入正确的日期格式,如2005-08-09");
                return 0;//因3个以上的"-".
            }

            if ((p.charAt(i)<"0")||(p.charAt(i)>"9")) {
                alert("请输入正确的日期格式,如2005-08-09");
                return 0;
            }
        }
        if (intJh!=2){
            alert("请输入正确的日期格式,如2005-08-09");
            return 0;
        }//没有2个减号

        if(parseInt(p.substring(p.length-2,p.length),10)<=0||parseInt(p.substring(p.length-2,p.length),10)>31){
            alert("请输入正确的日期格式,如2005-08-09");//
            return 0;//日期不在1到31的非法
        }
        var temp=p.substring(p.length-5,p.length-3);
//        alert(temp);
//        alert(parseFloat(temp));
        if(parseFloat(p.substring(p.length-5,p.length-3))<=0||parseFloat(p.substring(p.length-5,p.length-3))>12){
            alert("请输入正确的日期格式,如2005-08-09");//月份要在1到12之间
            return 0;//月份不在1到12的非法
        }
        return 1;
    }

    /**
     * Form表单序列化为json对象
     * @param formid
     * @returns {{}}
     * @private
     */
    function _serializeJson(formid){
        var form=document.getElementById(formid);
        var arr={};
        for (var i = 0; i < form.elements.length; i++) {
            var feled=form.elements[i];
            switch(feled.type) {
                case undefined:
                case 'button':
                case 'file':
                case 'reset':
                case 'submit':
                    break;
                case 'checkbox':
                case 'radio':
                    if (!feled.checked) {
                        break;
                    }
                default:
                    if (arr[feled.name]) {
                        arr[feled.name]=arr[feled.name]+','+feled.value;
                    }else{
                        arr[feled.name]=feled.value;

                    }
            }
        }
        return arr;
    }


    //这里确定了插件的名称
    window.formUtils = _FormUtils;

}(window,document));