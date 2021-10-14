var ajaxurl = 'http://' + (location.search.substr(1) === '' ? '127.0.0.1:8808' : decodeURIComponent(location.search.substr(1))) + '/getnews';

function zixun() {
    $('#xf-tab').remove()
    $('#contents').load('zixun.html', function () {
        $('#mytab').append($('#xf-tab'));
    });
    $('#app-title').text('')
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("xfshadow")
    $('body').css('background', '#fafafa')
    localStorage.setItem("lastPage", "zixun")

}

function wode() {
    $('#xf-tab').remove()
    $('#app-title').text('')
    $('#contents').load('my.html', function () {
        $('#mytab').append($('#xf-tab'));
    });
    $('body').css('background', '#fff')
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("mdui-shadow-0")
    localStorage.setItem("lastPage", "wode")


}

function xiaoxi() {
    $('#xf-tab').remove()
    $('#contents').load('xiaoxi.html', function () {
        $('#mytab').append($('#xf-tab'));
    });
    $('#app-title').text('私聊')
    $('body').css('background', '#fff')
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("mdui-shadow-0")
    localStorage.setItem("lastPage", "xiaoxi")
}

var isInAndroid = false;

function changeSize(stat, nav) {
    isInAndroid = true;
    $('#statpadding').css('height', '' + stat + 'px');
    $('#contents').css('padding-top', '' + (stat + 56) + 'px');
    $('#contents').css('padding-bottom', '' + nav + 'px');
    $('#navibar').css('padding-bottom', '' + nav + 'px');
    $('body').css('--top-bar-height', '' + stat + 'px')
    $('body').css('--bottom-bar-height', '' + nav + 'px')
}

var mydialog;
window.onload = () => {
    mydialog = new mdui.Dialog('#popup');
    $('#popup')[0].addEventListener('opened.mdui.dialog', function () {
        if (isInAndroid) {
            window.open("xianfei://darkTitleBar");
        }
    });
    $('#popup')[0].addEventListener('close.mdui.dialog', function () {
        if (isInAndroid) {
            window.open("xianfei://lightTitleBar");
        }
    });

}

function clickShow(href) {
    $('#popup').html('<br>');
    mydialog.open();
    $('#popup').load(href)
}

function backCallback() {
    if (mydialog.getState() === "closed") return 'exit';
    else mydialog.close();
    return '';
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function checkWord(str){
    var e = str.match(/(习近平|傻逼|操你\S|日你\S|草你\S|狗逼|六四事件|八九六四|共产党)/g)
    if(e){
        mdui.snackbar({
                        message: "包含敏感词："+JSON.stringify(e)
                    });
        return false;
    }else{
        return true;
    }
}