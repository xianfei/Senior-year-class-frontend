var ajaxurl = 'http://' + (location.search.substr(1) === '' ? '127.0.0.1:8808' : decodeURIComponent(location.search.substr(1))) + '/getnews';

var zixuntab = '';

var userInfo = JSON.parse(localStorage.getItem("loginUserInfo"));

var lastPage = "zixun"

var sTop = 0;

function zixun() {
    $('body').css('background', '#fff')

    $('#xf-tab').remove()
    $('#contents').hide()
    if (lastPage == "zixun" || zixuntab == '') $('#contents-main').load('zixun.html', function () {
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
    lastPage = "zixun"
    document.documentElement.scrollTop = sTop
    $('#add-button').show()
    window.history.replaceState({isReload: false}, '', '#home')

}

function wode() {
    $('body').css('background', '#fff')

    if (lastPage == "zixun") sTop = document.documentElement.scrollTop || document.body.scrollTop
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
    window.history.replaceState({isReload: false}, '', '#my')

}

function xiaoxi() {
    $('body').css('background', '#fff')

    if (lastPage == "zixun") sTop = document.documentElement.scrollTop || document.body.scrollTop
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
    window.history.replaceState({isReload: false}, '', '#chat')

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
        if (mydialog.getState() == "closed" && window.location.href.indexOf("#detail") == -1) backCallback()
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
    } else if (xfFrameCanGoBack) {
        $('#xf-frame').fadeOut(200)
        document.documentElement.scrollTop = sTop
        xfFrameCanGoBack = false;
        return ''
    }
    return 'exit';
}

function clickShowFull(href, more) {
    if (!more) more = ''
    $('#xf-frame').html('<br>');
    $('#xf-frame').load(href)
    $('#xf-frame').fadeIn(200)
    xfFrameCanGoBack = true;
    window.history.pushState({isReload: false}, '', window.location.href)
    window.history.replaceState({isReload: false}, '', '#detail' + more)
    if (lastPage == "zixun") sTop = document.documentElement.scrollTop || document.body.scrollTop
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


var initPhotoSwipeFromDOM = function (gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };


            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        var ev = window.event || arguments.callee.caller.arguments[0];
        if (window.event) ev.cancelBubble = true;
        else {
            ev.stopPropagation();
        }
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }


        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);
            if (isInAndroid) {
                window.open("xianfei://darkTitleBar");
            }
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
        gallery.listen('close', function () {
            if (isInAndroid) {
                window.open("xianfei://lightTitleBar");
            }
        });
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};
