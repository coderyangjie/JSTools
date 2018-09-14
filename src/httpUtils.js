/**
 * 服务器交互通信工具类
 * Created by yangjie on 2018/9/14.
 */
;//JavaScript 弱语法的特点,如果前面刚好有个函数没有以";"结尾,那么可能会有语法错误，因此在这里加上";"号。
//使用自调用匿名函数封装(防止插件用户定义的函数名与插件名冲突)
(function(window,document){
    //定义一些默认参数
    var _options={
        parameterName:"parameterValue"

    };

    //定义一些API方法
    var _HttpUtils = {
        createXHR: _createXHR,
        ajax:_ajax,
        jsonp:_jsonp,
        formatParams:_formatParams

    };

    /**
     * 获取XMLHTTPRequest对象
     * @returns {*}
     * @private
     */
    function _createXHR(){
        if(window.XMLHttpRequest) { //IE7+、Firefox、Opera、Chrome 和Safari
            return new XMLHttpRequest();
        } else if(window.ActiveXObject) { //IE6 及以下
            var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
            for(var i = 0, len = versions.length; i < len; i++) {
                try {
                    return new ActiveXObject(version[i]);
                    break;
                } catch(e) {
                    //跳过
                }
            }
        } else {
            throw new Error('浏览器不支持XHR对象！');
        }
    }

    function _ajax(options){
        options = options || {}; //如果没有数据传入则赋值{}
        if(!options.url) {
            throw new Error("参数不合法");
        }

        options.data = options.data || {};
        options.type = options.type || 'get';

        //获取XMLHTTPRequest对象
        var XHR = _createXHR();

        //判断传递的类型
        switch(options.type.toLowerCase()) {
            case 'get':
                XHR.open('GET', options.url + '?' + _formatParams(options.data), true);
                //发送数据
                XHR.send(null);
                break;
            case 'post':
                XHR.open('POST', options.url, true);
                XHR.setRequestHeader('content-type', 'application/x-www-form-urlencoded'); //设置请求头
                XHR.send(_formatParams(options.data));
                break;
        }

        //接收数据 --监控状态
        XHR.onreadystatechange = function() {
            if(XHR.readyState === 4) {
                if(XHR.status >= 200 && XHR.status < 300 || XHR.status === 304) {
                    //执行成功的回调函数
                    options.success && options.success(JSON.parse(XHR.responseText));
                } else {
                    options.error && options.error(xhr.status);
                }
            }
        }
    }

    function _jsonp(options){
        options = options || {};
        if(!options.url || !options.callback) {
            throw new Error("参数不合法");
        }

        //创建script标签并加入到页面
        var oScript = document.createElement('script');
        var oHead = document.getElementsByTagName('head')[0];
        var callbackName = ('jsonp_callback_' + Math.random()).replace(".", "");
        oHead.appendChild(oScript);

        options.data[options.callback] = callbackName;
        var params = _formatParams(options.data); // 格式化数据

        //创建jsonp回调函数
        //注意：由于script标签的src属性只有第一次设置的时候会有效，因此导致script标签是无法重用的，所以每次完成操作后都需要移除它。
        //callbackName是一个变量 - 而且必须是全局变量 - 因此window[callbackName]使用完后也需要移除
        window[callbackName] = function() {
            options.success && options.success(json);
            oHead.removeChild(oScript);
            try{
                delete window[callbackName];
            } catch(e) {}
            window[callbackName] = null;
        }

        //发送请求
        oScript.src = options.url + (options.url.indexOf("?") > -1 ? "" : "?") + params;
    }


    /**
     * 数据参数格式化
     * @param data
     * @returns {string}
     */
    function _formatParams(data) {
        var arr = [];
        for(var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        return arr.join('&');
    }



    //这里确定了插件的名称
    window.httpUtils = _HttpUtils;

}(window,document));