var ajaxurl = 'http://' + (location.search.substr(1) === '' ? '127.0.0.1:8808' : decodeURIComponent(location.search.substr(1))) + '/getnews';

var zixuntab = '';

var userInfo = JSON.parse(localStorage.getItem("loginUserInfo"));

var lastPage = "zixun"

var sTop = 0;
function zixun() {
        $('body').css('background', '#fff')

    $('#xf-tab').remove()
    $('#contents').hide()
    if(lastPage=="zixun"||zixuntab=='')$('#contents-main').load('zixun.html', function () {
        $('#mytab').append($('#xf-tab'));
        zixuntab = $('#xf-tab')
    });
    else {
        $('#mytab').append(zixuntab);
    }
    $('#contents-main').show()
    $('#app-title').text('')
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("xfshadow")
    localStorage.setItem("lastPage", "zixun")
    lastPage  = "zixun"
    document.documentElement.scrollTop = sTop
    $('#add-button').show()
        window.history.replaceState({ isReload: false }, '', '#home')

}

function wode() {
        $('body').css('background', '#fff')

    if(lastPage =="zixun") sTop = document.documentElement.scrollTop || document.body.scrollTop
    lastPage = "wode"
    $('#xf-tab').remove()
    $('#app-title').text('')
    $('#contents-main').hide()
    $('#contents').load('my.html', function () {
        $('#contents').show()
        $('#mytab').append($('#xf-tab'));
    });
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("mdui-shadow-0")
    localStorage.setItem("lastPage", "wode")
    $('#add-button').hide()
        window.history.replaceState({ isReload: false }, '', '#my')

}

function xiaoxi() {
        $('body').css('background', '#fff')

        if(lastPage=="zixun") sTop = document.documentElement.scrollTop || document.body.scrollTop
    $('#xf-tab').remove()
    $('#contents-main').hide()
    $('#contents').load('xiaoxi.html', function () {
        $('#contents').show()
        $('#mytab').append($('#xf-tab'));
    });
    $('#app-title').text('私聊')
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("mdui-shadow-0")
    localStorage.setItem("lastPage", "xiaoxi")
    lastPage = "xiaoxi"
    $('#add-button').hide()
        window.history.replaceState({ isReload: false }, '', '#chat')

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
            // window.history.pushState({ isReload: false }, '', window.location.href)
        if (isInAndroid) {
            window.open("xianfei://darkTitleBar");
        }
    });
    $('#popup')[0].addEventListener('close.mdui.dialog', function () {
        if (isInAndroid) {
            window.open("xianfei://lightTitleBar");
        }
    });

    window.addEventListener("popstate", function (e) {
        if (mydialog.getState() == "closed")backCallback()
    },false)

}

function clickShow(href) {
    $('#popup').html('<br>');
    $('#popup').load(href)
    mydialog.open();
}

function backCallback() {
    if (mydialog.getState() !== "closed") {
        mydialog.close();
        return ''
    }else if(xfFrameCanGoBack){
        $('#xf-frame').fadeOut(200)
        document.documentElement.scrollTop = sTop
        xfFrameCanGoBack = false;
        return ''
    }
    return 'exit';
}

function clickShowFull(href,more) {
    if(!more)more = ''
    $('#xf-frame').html('<br>');
    $('#xf-frame').load(href)
    $('#xf-frame').fadeIn(200)
    xfFrameCanGoBack = true;
    window.history.pushState({ isReload: false }, '', window.location.href)
    window.history.replaceState({ isReload: false }, '', '#detail'+more)
    if(lastPage =="zixun") sTop = document.documentElement.scrollTop || document.body.scrollTop
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
    var e = str.match(/(傻逼|操你\S|日你\S|草你\S|狗逼|六四事件|八九六四)/g)
    if(e){
        mdui.snackbar({
                        message: "包含敏感词："+JSON.stringify(e)
                    });
        return false;
    }else{
        return true;
    }
}