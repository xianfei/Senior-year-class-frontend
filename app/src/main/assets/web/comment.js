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
            document.querySelector("meta[name=theme-color]").setAttribute("content", "#000000");
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
            document.querySelector("meta[name=theme-color]").setAttribute("content", "#ffffff");

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

var lastMomentId = -2;

function addTenCard(onSucceedsFun, type, target) {
    try {
        $.ajax({
            type: 'POST',
            timeout: 5000,
            url: 'http://39.106.25.203:1480/moment/getUsersMoments',
            data: {
                lastMomentId: lastMomentId + 1,
                length: 20,
                targetUserId: target ? target : localStorage.getItem('loginUser'),
                userId: localStorage.getItem('loginUser')
            },
            success: function (result) {
                console.log(result)
                if (onSucceedsFun) onSucceedsFun(result.result.message.length === 0)
                for (var res of result.result.message) {
                    lastMomentId = res.momentId
                    var media
                    if (res.appendixType === '1') {
                        imgss = ''
                        var imgs = res.photos.split(';').filter(i=>i && i.trim())
                        for (const img of imgs) {
                            if ((!img) || img === '') continue
                            imgss += String.raw`<figure class="xf-fig" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
<a href="${'http://39.106.25.203' + img}" itemprop="contentUrl"><img onload="this.parentNode.setAttribute('data-size', this.naturalWidth + 'x' + this.naturalHeight);" src="${'http://39.106.25.203' + img}"  itemprop="thumbnail" /></a>
</figure>`
                        }
                        if (imgs.length  === 1)
                            media = String.raw`<div class="mdui-card-media test_img" id="gallery-id-${res.momentId}">${imgss}</div>`
                        else if (imgs.length  === 2 || imgs.length  === 4)
                            media = String.raw`<div class="mdui-card-media test_img_2" id="gallery-id-${res.momentId}" style="overflow: hidden;border-radius: 10px;line-height: 0;margin: 5px"><div style="margin: -2px">${imgss}</div></div>`
                        else
                            media = String.raw`<div class="mdui-card-media test_img_3" id="gallery-id-${res.momentId}" style="overflow: hidden;border-radius: 10px;line-height: 0;margin: 5px"><div style="margin: -2px">${imgss}</div></div>`

                    } else if (res.appendixType === '4')
                        media = String.raw`<button onclick="clickShowIframe('cli-viewsource.html?${res.momentId}')" style="display: none">显示源代码</button><iframe class="test_iframe" src="cli-runtime.html?${res.momentId}" sandbox="allow-scripts"></iframe>`
                    else if (res.appendixType === '2') {
                        media = String.raw`<div class="test_img"><video controls><source src="${'http://39.106.25.203' + res.video}" type="video/mp4"></video></div>`
                    } else media = ''
                    $('#test').append(
                        (type === 'user' ? String.raw`<div class="momentCard" onclick="parent.window.currentMoment = this.innerHTML;parent.window.currentID = ${res.momentId};clickShowFull('detail.html','-moment-id-${res.momentId}');">` : String.raw`<div class="momentCard" onclick="currentMoment = this.innerHTML;currentID = ${res.momentId};clickShowFull('detail.html','-moment-id-${res.momentId}');">`) + String.raw`
                    <div xf-user-id="${res.userID}" xf-moment-id="${res.momentId}" class="momentInfo"></div>
                 <div class="mdui-card-header" style="padding: 16px 5px 10px;max-width: 230px;">
    <img class="mdui-card-header-avatar" style="object-fit:cover" src="${res.userAvatar}" onclick="var ev = window.event || arguments.callee.caller.arguments[0];if (window.event) ev.cancelBubble = true;
else { ev.stopPropagation();}clickShowIframe('userpage.html?${res.userID}')"/>
    <div class="mdui-card-header-title" onclick="var ev = window.event || arguments.callee.caller.arguments[0];if (window.event) ev.cancelBubble = true;
else { ev.stopPropagation();}clickShowIframe('userpage.html?${res.userID}')">${res.userName}</div>
    <div class="mdui-card-header-subtitle">
    ${new Date(res.time).format("yyyy-MM-dd hh:mm:ss")}</div>
  </div>
                  <div class="mdui-card-primary-title" style="margin-left: 5px;font-size: 18px;line-height: 26px;overflow : hidden;white-space: pre-line;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: var(--max-line-clamp);-webkit-box-orient: vertical;">${res.text}</div>
 ${media}<div class="mdui-card-header-subtitle" style="text-align: end;padding:5px 0 10px 0">
<div><span onclick="var ev = window.event || arguments.callee.caller.arguments[0];if (window.event) ev.cancelBubble = true;
else { ev.stopPropagation();}thumbUpMoment(this) "><i class="mdui-icon material-icons${res.isLiked ? ' mdui-icon-red' : ''}">favorite_border</i> ${res.likedNum} &nbsp;&nbsp;
</span><span onclick="var ev = window.event || arguments.callee.caller.arguments[0];if (window.event) ev.cancelBubble = true;
else { ev.stopPropagation();}prompt('评论##请输入评论内容')"><i class="mdui-icon material-icons">chat_bubble_outline</i> ${res.commentNum} </span> &nbsp;&nbsp;&nbsp;&nbsp;</div>


                </div><div style="width: 95%;height: 1px;background: #eee;margin: auto;"></div>`)
                    if (res.appendixType == '1') {
                        initPhotoSwipeFromDOM(`#gallery-id-${res.momentId}`);
                    }
                    num++;
                }
            }, error: function (jqXHR, exception) {
                var msg = '';
                if (exception === 'timeout') {
                    msg = '连接超时.';
                } else if (jqXHR.status === 0) {
                    msg = '无法连接到服务器.\n';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = '连接超时.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                $('#test').append(String.raw`<div id="errorInfo" style="border-radius: 20px;margin: 30px 35px 10px 35px;overflow: visible;height: 100px" class="mdui-card mdui-shadow-3">
                <img src="img/crying-cat.png" style="width: 80px;height: 80px;margin-left: -30px;margin-top: -35px">
                <span style="color: #ffb739;font-size: 20px;font-weight: 600;top: -15px;position: relative;">错误</span>
                <br><span style="margin-left: 30px;margin-right: 10px">${msg}</span>

            </div>`);
            }
        });
    } catch (e) {
        $('#test').append(String.raw`<div id="errorInfo" style="border-radius: 20px;margin: 30px 35px 10px 35px;overflow: visible;height: 100px" class="mdui-card mdui-shadow-3">
                <img src="img/crying-cat.png" style="width: 80px;height: 80px;margin-left: -30px;margin-top: -35px">
                <span style="color: #ffb739;font-size: 20px;font-weight: 600;top: -15px;position: relative;">错误</span>
                <br><span style="margin-left: 30px;margin-right: 10px">${e}</span>

            </div>`);
    }


}

function thumbUpMoment(e){
    console.log(e.innerHTML)
    if(e.innerHTML.indexOf('mdui-icon-red')===-1)
    e.innerHTML = e.innerHTML.replace(/\d+/g,'$1'+1).replace('material-icons','material-icons mdui-icon-red');
    else e.innerHTML = e.innerHTML.replace(/\d+/g,'$1'-1).replace(' mdui-icon-red','');


}