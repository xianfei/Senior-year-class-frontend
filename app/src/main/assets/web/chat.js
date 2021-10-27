function mapToJson(map) {
    return JSON.stringify([...map]);
}

function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

var chatMessage = new Map();
if(localStorage.getItem('chatMap')){
    chatMessage =jsonToMap(localStorage.getItem('chatMap'))
    updateMessage()
}

var myId = localStorage.getItem('loginUser')

var socket;
if (!window.WebSocket) {
    window.WebSocket = window.MozWebSocket;
}
if (window.WebSocket) {
    socket = new WebSocket("ws://localhost:8080/ws");
    socket.onmessage = function (event) {
        event.data.text().then((t)=>{
            console.log(t)
            var d = JSON.parse(t)
        // 判断是自己的消息
        if (d.toUserID === myId) {
            if (!chatMessage.has(d.formUserID)) chatMessage.set(d.formUserID, [])
            else chatMessage.get(d.formUserID).push(d)

            // 确认收到
            var s = Object.assign({}, d);
            s.type = 'ack'
            send(JSON.stringify(s))
            // 更新GUI
            updateMessage()
            // 持久化消息
            localStorage.setItem('chatMap',mapToJson(chatMessage))
        }
        })

    };
    socket.onopen = function (event) {
        console.log("聊天系统：连接成功!");
    };
    socket.onclose = function (event) {
        console.log("聊天系统：连接被关闭");
    };
} else {
    console.log("聊天系统：你的浏览器不支持 WebSocket！");
}

function send(message) {
    if (!window.WebSocket) {
        return;
    }
    if (socket.readyState == WebSocket.OPEN) {
        socket.send(message);
    } else {
        alert("无法连接到服务器");
    }
}

function updateMessage(){
    var html = ''
    for(dd of [...chatMessage].sort((a,b)=>{return b[1][b.length-1].time-a[1][a.length-1].time;})){
        console.log(dd)
        html+=String.raw`<li class="mdui-list-item mdui-ripple">
            <div class="mdui-list-item-avatar"><img src="img/avatar.jpg"/></div>
            <div class="mdui-list-item-content" style="margin-top: -16px">${dd[0]}</div>
            <div class="mdui-list-item-content"
                 style="margin-top: 21px;position: absolute;margin-left: 56px;font-size: 14px;color: #555;">${dd[1][dd[1].length-1].message}
            </div>
        </li>`}
    $('#chat-list').html(html)
}

function sendMessage(to, message) {
    var d = {type:'message',formUserID: myId, toUserID: to, message: message, time: new Date().getTime()}
    send(JSON.stringify(d))
    console.log(chatMessage.get('16888'))
    if (!chatMessage.has(d.formUserID)) chatMessage.set(d.formUserID, [])
    else chatMessage.get(d.formUserID).push(d)
        console.log(chatMessage.get('16888'))

}