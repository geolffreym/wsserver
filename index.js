/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey Mena
 * Date: 10-19-13
 * Time: 02:11 PM
 * To change this template use File | Settings | File Templates.
 */
var _webSocketServer = require('websocket').server;

var wsServer = function (httpServer) {
    var _proto = this.__proto__;

    this.wsServer = new _webSocketServer({
        httpServer: httpServer
    });

    this.clients = {};
    this.admins = {};
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.connection = {};
    this.host = 'localhost:8080';

    //Valid Host
    _proto.setMyHost = function(host){
        this.host = host;
    };

    /**SEND TO USER
     * @param go
     */
    _proto.sendTo = function (go) {
        if (!!go.to) {
            if (!!this.connection[go.protocol][go.to]) {
                this.connection[go.protocol][go.to]['handshake'].sendUTF(
                    JSON.stringify(go)
                );
            } else {
                go.response = 'offline_user';
                this.sendBack(go);
            }
        }
    };

    /**SEND TO ALL USERS
     * @param go
     */
    _proto.sendAll = function (go) {
        if (!!go.from) {
            if (!!this.connection[go.protocol][go.from]) {
                var _admin = this.connection[go.protocol][go.from]['admin'],
                    _clients = this.clients[_admin];

                for (var z in _clients) {
                    go.to = z;
                    this.sendTo(go);
                }
            }
        }
    };

    /**SEND BACK USER
     * @param go
     */
    _proto.sendBack = function (go) {
        if (!!go.from) {
            go.to = go.from;
            this.sendTo(go);
        }
    };

    /**EVENT HANDLER
     * @param event
     * @param callback
     * @returns {*}
     */
    _proto.on = function (event, callback) {
        var self = this;
        if (!callback) {
            return false;
        }
        return [{
            'message': function () {
                self.onmessage = callback;
            },
            'close': function () {
                self.onclose = callback;
            },
            'error': function () {
                self.onerror = callback;
            }
        }[event]()];
    };

    //START SERVER
    _proto.run = function () {
        var self = this;

        self.wsServer.on('request', function (request) {
            var _urlParsed = request.resourceURL.query,
                _host = request.host,
                _protocol = !!_urlParsed.protocol
                    ? _urlParsed.protocol : 'default',
                _user = !!_urlParsed.user
                    ? _urlParsed.user : 'default',
                _admin = !!_urlParsed.admin
                    ? _urlParsed.admin : 'temp';

            console.log(' Conectando desde ' + _host + '.');

            if (_host.indexOf(self.host) > -1) {
                var _connection = request.accept(null, request.origin);

                if (!self.clients[_admin]) {
                    self.clients[_admin] = [];
                }

                if (!self.connection[_protocol]) {
                    self.connection[_protocol] = {};
                }

                if (!self.connection[_protocol][_user]) {
                    self.connection[_protocol][_user] = {
                        protocol: _protocol,
                        user: _user,
                        admin: _admin,
                        handshake: _connection
                    }
                }

                if (_admin === _user) {
                    self.admins[_user] = {};
                    self.admins[_user]['state'] = 1;
                    self.admins[_user]['user'] = _admin;
                } else {
                    self.clients[_admin].push(_user);
                }

                console.log('Conexion Aceptada: ' + _user);
            } else {
                console.log('Conexion Rechazada.');
                return false;
                /**Kill*/
            }

            //Message Handler
            _connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    var go = JSON.parse(message.utf8Data);

                    if (self.onmessage) {
                        self.onmessage(go);
                    }

                    if (!!go.all) {
                        self.sendAll(go);
                        return false;
                    }
                    self.sendTo(go);
                }
            });

            //Close Handler
            _connection.on('close', function () {
                if (!!self.clients[_protocol][_admin][_user])
                    delete self.clients[_protocol][_admin][_user];

                if (!!self.admins[_user])
                    delete self.admins[_user];

                if (!!self.connection[_protocol][_user])
                    delete self.connection[_protocol][_user];

                if(self.onclose){
                    self.onclose();
                }
                console.log("Desconectado Cliente " + _user);
            });

            //Error Handler
            _connection.on('error', function (e) {
                console.log('Error' + e)
                if(self.onerror){
                    self.onerror();
                }
            });

        });
    }

};

/**Exportando*/
module.exports = wsServer;