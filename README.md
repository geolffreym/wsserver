Websocket Server
=========================
Socket connection manager, protocols and administrators.

Usage
------

Websocket Usage:

The manager needs to get through a query string, the administrator, the user and the protocol.
This to generate a separate structure for each service provided by each protocol, you can use different protocols with different users and administrators. A tree structure is generated.
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

The default values ​​for the protocol is 'default' for the customer is 'default' and the manager is 'temp'

Server Side
-----------
```js
var _http = require('http'),
    _wsServer = require('wsserver');

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