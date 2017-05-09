Websocket Server
=========================
Connection manager using socket, protocol management, customers and managers. 

Usage
------

Websocket Usage:

The manager needs to get through a query string, the administrator, the user and the protocol. 
This to generate a separate structure for each service provided by each protocol, you can use different protocols with different users and Administradors. A tree structure is generated. 
example: 

    {protocol} ->  {admin}  -> {client}
                            -> {client2}  
                            -> {client3}  
                   {admin2} -> {client1} 
                            -> {client2} 
                           
    {protocol2} -> {admin}  -> {client}
                            -> {client2}  
                            -> {client3}  
                   {admin2} -> {client1} 
                            -> {client2} 

This makes it much easier to manage the behavior of each service, without affecting each other. 
You can shut down one service, keeping active the other services without problem. 

[Syrup](https://github.com/geolffreym/Syrup) is part of this implementation and has the tools necessary for the operation of this service.

The default values ​​for the protocol is 'default' for the customer is 'default' and the manager is 'temp'

Server Side
-----------
```js
var _http = require('http'),
    _wsServer = require('b_wsserver');

/**Http Server
 * @type {*}
 * @private
 */
_server = _http.createServer(function (request, response) {

}).listen(_webServerPort, function () {
    console.log("Listening on Port " + _webServerPort);
});


/**wsSocket Server
 * @type {_wsServer}
 * @private
 */
_wsServer = new _wsServer(_server);

//You need to check the connections come from a valid client
_wsServer.setMyHost('mydomain.com');

//Events Handler
_wsServer.on('message', function (message) {
    //The native MESSAGE functions are executed automatically
    
    //Extra Control
    //On receive messages what to do?
});

_wsServer.on('close', function (message) {
       //The native CLOSE functions are executed automatically
    
       //Extra Control
       //On socket close what to do?
});
  
_wsServer.on('error', function (message) {
      //The native ERROR functions are executed automatically
    
      //Extra Control
      //On socket error what to do?
});

//Run Server
_wsServer.run();
   
```

Client Side
----------

```js    
//Creating Connections 

var _socket  = new WebSocket('ws://MY_URL'?admin=mike&user=carl&protocol=chat);

The administrator is validated and created, when user == admin in the server:

    ?admin=mike&user=mike&protocol=chat
    
if you do not need a administrator just:

    ?user=mike&protocol=chat

// When the connection is open, send some data to the server

_socket.onopen = function () {
        //Sending Message
        _socket.send(JSON.stringify({
                        to : 'carl', //Receipt
                        protocol : 'chat', // Opened Protocol
                        message : 'Hi' // Message
                    })); 
};

// Log errors
_socket.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
_socket.onmessage = function (e) {
  console.log('Server: ' + e.data);
};

```


Using Syrup
----------

*Complex Process*
```js

 var _socket = new Socket;
 
 _socket.set(
     {
        user: 'Mike', // My local User
        protocol: 'chat', // The protocol
        port: '8080' // Optinal default 8080,
        //admin: 'Carl' //Optional default temp
     }
 );
 
 _socket.on('message', function(object){
    //DO something
 });
 
 _socket.on('open', function(){
      _socket.send({
         msg:'Hi',
         to:'Joan',
         protocol:'chat'
         //all:true If ALL is TRUE, the message is send to all the user in the protocol
      });
 });

```
*Using Shortcuts* 
```js
 
 var _shorcuts = new Shorcuts;
 
 _shorcuts.socketListen({
    user: 'mike', // Local User
    protocol : 'chat' // Protocol
 }, function(object){
    //Receiving message DO something
 });
 
 _shorcuts.socketSend({
         to: 'spike',
         protocol : 'chat',
         msg: 'Hi'
 })
    
```