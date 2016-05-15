#!/usr/bin/env node
var WebSocketServer = require('websocket').server,
    http = require('http'),
    fs = require('fs');

var server = http.createServer(function(request, response) {
  /*var filePath;
  if (request.url == '/') {
    filePath = './index.html';
  } else {
    filePath = './client.js';
  }
  var data = fs.readFileSync(filePath, 'utf8');
  console.log((new Date()) + " Received request for " + request.url);
  response.end(data);*/
});

server.listen(8082, function() {
  console.log((new Date()) + " Server is listening on port 8082");
});

wsServer = new WebSocketServer({
  httpServer: server,
  maxReceivedFrameSize: 0x1000000,
  autoAcceptConnections: false
});

var binary = '{ "type":"text"}';
//
wsServer.on('request', function(request) {

  var connection = request.accept(null, request.origin);
  console.log(" Connection accepted.");
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // NOP
    }
    //mensagem do cliente notebook
    else if (message.type === 'binary') {
      binary = message.binaryData;     
      connection.send('{ "type":"text"}');
      return;
    }
    //se passou para chegar até aqui 
    //é porque foi uma mensagem do cliente rasp
      connection.send(binary);
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
  });
});
