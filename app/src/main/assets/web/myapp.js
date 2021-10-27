var ajaxurl = 'http://127.0.0.1:8808/getnews';

var homepagetab = '';

var userInfo = JSON.parse(localStorage.getItem("loginUserInfo"));

var lastPage = "homepage"

var sTop = 0;

var xfFrameStack = []

function homepage() {
    $('body').css('background', '#fff')

    $('#xf-tab').remove()
    $('#contents-mes').hide()
    $('#contents-my').hide()
    if (lastPage == "homepage" || homepagetab == '') $('#contents-main').load('homepage.html', function () {
        $('#mytab').append($('#xf-tab'));
        homepagetab = $('#xf-tab')
    });
    else {
        $('#mytab').append(homepagetab);
    }
    $('#contents-main').show()
    $('#app-title').text('')
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("xfshadow")
    localStorage.setItem("lastPage", "homepage")
    lastPage = "homepage"
    document.documentElement.scrollTop = sTop
    $('#add-button').show()
    window.history.replaceState({isReload: false}, '', '#home')

}

function wode() {
    $('body').css('background', '#fff')

    if (lastPage == "homepage") sTop = document.documentElement.scrollTop || document.body.scrollTop
    lastPage = "wode"
    $('#xf-tab').remove()
    $('#app-title').text('')
    $('#contents-main').hide()
    $('#contents-my').show()
    $('#contents-mes').hide()
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("mdui-shadow-0")
    localStorage.setItem("lastPage", "wode")
    $('#add-button').hide()
    window.history.replaceState({isReload: false}, '', '#my')

}

function chat() {
    $('body').css('background', '#fff')

    if (lastPage == "homepage") sTop = document.documentElement.scrollTop || document.body.scrollTop
    $('#xf-tab').remove()
    $('#contents-main').hide()
    $('#contents-my').hide()
    $('#contents-mes').show()


    $('#app-title').text('私聊')
    $('#tabbar').removeClass("xfshadow")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("mdui-shadow-0")
    localStorage.setItem("lastPage", "chat")
    lastPage = "chat"
    $('#add-button').hide()
    window.history.replaceState({isReload: false}, '', '#chat')

}

var isInAndroid = false;

function changeSize(stat, nav) {
    isInAndroid = true;
    $('#statpadding').css('height', '' + stat + 'px');
    $('#navibar').css('padding-bottom', '' + nav + 'px');
    $('body').css('--top-bar-height', '' + stat + 'px')
    $('body').css('--bottom-bar-height', '' + nav + 'px')
}

var mydialog;
window.onload = () => {
    $('#contents-my').load('my.html');
    $('#contents-mes').load('chat.html');
    mydialog = new mdui.Dialog('#popup');
    $('#popup')[0].addEventListener('opened.mdui.dialog', function () {
        // window.history.pushState({ isReload: false }, '', window.location.href)
        if (isInAndroid) {
            window.open("xianfei://darkTitleBar");
        }
        document.querySelector("meta[name=theme-color]").setAttribute("content", "#aaaaaa");

    });
    $('#popup')[0].addEventListener('close.mdui.dialog', function () {
        if (isInAndroid) {
            window.open("xianfei://lightTitleBar");
        }
        document.querySelector("meta[name=theme-color]").setAttribute("content", "#ffffff");
    });

    window.addEventListener("popstate", function (e) {
        if (mydialog.getState() === "closed" && xfFrameStack.length > 0) backCallback()
    }, false)

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
    } else if (xfFrameStack.length > 0) {
        var e = xfFrameStack.pop()
        $('#' + e.id).remove()
        document.documentElement.scrollTop = e.sTop
        return ''
    }
    return 'exit';
}

function _clickShowFrame(pageDesc) {
    xfFrameStack.push({
        id: 'xf-frame-' + xfFrameStack.length + 1,
        sTop: document.documentElement.scrollTop || document.body.scrollTop
    })
    $('#xf-frame-stack').append(`<div id="${xfFrameStack[xfFrameStack.length - 1].id}" style="width: 100%;height: 100%;z-index: 1000;position: fixed;background: white;display: none;overflow: scroll;"></div>`)
    window.history.pushState({isReload: false}, '', window.location.href)
    window.history.replaceState({isReload: false}, '', '#detail' + (pageDesc ? pageDesc : ''))
    return '#' + xfFrameStack[xfFrameStack.length - 1].id
}

function clickShowFull(href, more) {
    var e = _clickShowFrame(more ? more : '')
    $(e).load(href)
    $(e).fadeIn(200)

}

function clickShowIframe(href, more) {
    var e = _clickShowFrame(more)
    $(e).html('<iframe src="' + href + '" style="border: none;height: calc(100% - var(--top-bar-height));width:100%;margin-top: var(--top-bar-height)"> </iframe>');
    $(e).fadeIn(200)
}


function checkWord(str) {
    var e = str.match(/(傻逼|操你\S|日你\S|草你\S|狗逼|六四事件|八九六四)/g)
    if (e) {
        mdui.snackbar({
            message: "包含敏感词：" + JSON.stringify(e)
        });
        return false;
    } else {
        return true;
    }
}



