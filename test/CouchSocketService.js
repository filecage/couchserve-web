(function(global) {
    var CouchSocketService = function (host, port) {
        var self = this;
        this.handler = {};
        this.socket = new WebSocket('ws://' + host + ':' + port + '/couchServe');

        // error handling
        this.socket.onerror = function (error) {
            console.error(error);
        };

        // connection init handling
        this.socket.onopen = function () {
            console.log('connection established!');
            self.send({action: 'SYNC'});
        };

        // message handling
        this.socket.onmessage = function (message) {
            console.log(message);
            var data = JSON.parse(message.data);
            if (data.type && self.handler[data.type]) {
                self.handler[data.type](data, message);
            } else {
                console.log({info: 'unbinded event type occurred', type: type, data: data, message: message});
            }
        }
    };

    CouchSocketService.prototype.send = function (data) {
        this.socket.send(JSON.stringify(data));
        return this;
    };

    CouchSocketService.prototype.on = function (type, handler) {
        this.handler[type] = handler;
        return this;
    };

    global.CouchSocketService = CouchSocketService;

})(window);