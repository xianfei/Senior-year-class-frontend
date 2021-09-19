var ajaxurl='http://'+(location.search.substr(1)===''?'127.0.0.1':decodeURIComponent(location.search.substr(1)))+'/getnews';

function zixun(){
    $('#xf-tab').remove()
    $('#contents').load('zixun.html',function(){$('#mytab').append($('#xf-tab'));});
    $('#app-title').text('')
    $('#tabbar').removeClass("mdui-shadow-3")
    $('#tabbar').removeClass("mdui-shadow-0")
    $('#tabbar').addClass("mdui-shadow-3")
    $('body').css('background','#fafafa')
}

function wode(){
    $('#xf-tab').remove()
    $('#contents').load('my.html',function(){$('#mytab').append($('#xf-tab'));});
    $('body').css('background','#fff')
    $('#tabbar').removeClass("mdui-shadow-3")
    $('#tabbar').removeClass("mdui-shadow-0")
        $('#tabbar').addClass("mdui-shadow-0")


}

function xiaoxi(){
    $('#xf-tab').remove()
    $('#contents').load('xiaoxi.html',function(){$('#mytab').append($('#xf-tab'));});
    $('#app-title').text('私聊')
    $('body').css('background','#fff')
    $('#tabbar').removeClass("mdui-shadow-3")
    $('#tabbar').removeClass("mdui-shadow-0")
        $('#tabbar').addClass("mdui-shadow-0")

}

function changeSize(stat,nav){
    $('#statpadding').css('height',''+stat+'px');
    $('#contents').css('padding-top',''+(stat+56)+'px');
    $('#contents').css('padding-bottom',''+nav+'px');
    $('#navibar').css('padding-bottom',''+nav+'px');
}
var mydialog;
window.onload = ()=>{
    mydialog = new mdui.Dialog('#popup');

}

function clickShow(href){
    $('#popup').html('<iframe id="myiframe" src="'+href+'" style="border: none;width: 100%;"></iframe>');
    mydialog.open();
    $('#myiframe').css('height',$('#popup').css('height'))
    // $('#popup').load(href)
}

function backCallback(){
    if(mydialog.getState()==="closed")return 'exit';
    else mydialog.close();
    return '';
}

function talkwith(item){
    alert('你将要'+item.innerText.substring(2));
}