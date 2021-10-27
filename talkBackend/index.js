const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

var unreadMap = new Map()

server.on('open', function open() {
  console.log('connected');
});

server.on('close', function close() {
  console.log('disconnected');
});

server.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress;
  const port = req.connection.remotePort;
  const clientName = ip + port;

  console.log('%s is connected', clientName)

  // 发送欢迎信息给客户端
  unreadMap.forEach((v,k)=>{ws.send(JSON.stringify(v))})
  // ws.send("Welcome " + clientName);

  ws.on('message', function incoming(message) {
    console.log('received: %s from %s', message, clientName);
    var d = JSON.parse(message)

    if (d.type == "message") {
      unreadMap.set(d.formUserID+'-'+d.toUserID+'-'+d.message+'-'+d.time,d)
      // 广播消息给所有客户端
      server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }else if(d.type="ack"){
      unreadMap.delete(d.formUserID+'-'+d.toUserID+'-'+d.message+'-'+d.time)
    }
  });

});