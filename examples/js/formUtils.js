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
     * 根据自定义属性校验表单
     * @param strformid  表单id
     * @returns {boolean}
     */
    function _isSubmit(strformid)
    {
        var DEBUG = false;
        //得到表单对象
        var obj=document.getElementById(strformid)
        //循环表单对象中的元素做校验
        for (var i=0; i< obj.elements.length;i++)
        {
            elm=obj.elements[i];   //表单元素对象
            elmtype=elm.type;            //表单中INPUT元素的类型
            elmname =elm.name;           //元素名称
            elmvalue=elm.value;          //元属的值
            elmtag=elm.tagName;         //得到元素的标记名称

            //********取自定义属性***********
            elmdiy = elm.diy;					//自定义提示语句
            elmzdlx= elm.zdlx;         //得到字段类型
            elmisnull=elm.isnull;     //判断字段是否可以为空 （0 不能为空 1 可以为空）
            elmzdmc=elm.zdmc;//  得到字段中文名称
            elmmaxvalue=elm.elmmaxvalue;//得到数字类型最大值（可选）
            elmminvalue=elm.minvalue;//得到数字类型最小值 （可选）
            elmmaxLength=elm.maxLength;
            //   elmxsws=elm.xsws;//得到小数点位数
            elmiszw=elm.iszw ; //得到是否判断中文
            elmisjczf=elm.isjczf ;//得到是否判断非法字符(0为不可，1为可以)
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

                    if(DEBUG){alert("field is input field name: " + elm.name);}

                    //判断元素的类型
                    switch(elmtype)
                    {
                        case "text":

                            if(DEBUG){alert("field input type is text field name: " + elm.name);}

                            //判断字段是否为空（0 不能为空  1 可以为空 ）
                            if (elmisnull=="0" && isCheckNull(elmvalue))
                            {
                                if(DEBUG){alert("field is not null field name: " + elm.name + "\n field value: " + elm.value);}
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
                                        alert(elmzdmc+"输入字符超过定义长度！只能录入"+ elmmaxLength +"个字符，即个"+ tempMaxLength +"汉字！")
                                    }
                                    elm.focus();
                                    return false;
                                }
                                if(elmisjczf == 0)//检测非法字符
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
                                if(elmmaxvalue!="" && parseFloat(elmvalue) < elmmaxvalue)
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
                                if (elmisnull==0 && isCheckNull(elmvalue))
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
                                    if (isCheckEmail(elmvalue) && elmisnull==0)
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
                                if(elmisjczf == 0)//检测非法字符
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
                                    //alert("日期格式有误！");
                                    elm.focus();
                                    return false;
                                }
                            }
                            break;

                        case "password":

                            //判断字段是否为空（0 不能为空  1 可以为空 ）
                            if (elmisnull==0 && isCheckNull(elmvalue))
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
                            if(elmisjczf == 0)//检测非法字符
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
                            if (elmisnull==0 && isCheckNull(elmvalue))
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
                            if( elmisnull==0 )
                            {
                                //判断是否选择
                                var ratemp = obj.elements[elm.name];
                                if(DEBUG){alert("run swith case radio: " + elm.value);}
                                if(DEBUG){alert("run swith case radio");}

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
                                    ratemp[tempI].focus();
                                    return false;
                                }
                            }
                            break;

                        case "checkbox":
                            if( elmisnull==0 )
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
                    if (elmisnull==0 && isCheckNull(elmvalue))
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