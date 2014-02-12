var parser = require('./parser.js');
var net = require('net');
var util = require('util');
var events = require('events');
var IncomingMessage = require('./IncomingMessage.js');
var ServerResponse = require('./ServerResponse.js');

var exports = module.exports;

exports.STATUS_CODES = {
  100 : 'Continue',
  101 : 'Switching Protocols',
  102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
  200 : 'OK',
  201 : 'Created',
  202 : 'Accepted',
  203 : 'Non-Authoritative Information',
  204 : 'No Content',
  205 : 'Reset Content',
  206 : 'Partial Content',
  207 : 'Multi-Status',               // RFC 4918
  300 : 'Multiple Choices',
  301 : 'Moved Permanently',
  302 : 'Moved Temporarily',
  303 : 'See Other',
  304 : 'Not Modified',
  305 : 'Use Proxy',
  307 : 'Temporary Redirect',
  400 : 'Bad Request',
  401 : 'Unauthorized',
  402 : 'Payment Required',
  403 : 'Forbidden',
  404 : 'Not Found',
  405 : 'Method Not Allowed',
  406 : 'Not Acceptable',
  407 : 'Proxy Authentication Required',
  408 : 'Request Time-out',
  409 : 'Conflict',
  410 : 'Gone',
  411 : 'Length Required',
  412 : 'Precondition Failed',
  413 : 'Request Entity Too Large',
  414 : 'Request-URI Too Large',
  415 : 'Unsupported Media Type',
  416 : 'Requested Range Not Satisfiable',
  417 : 'Expectation Failed',
  418 : 'I\'m a teapot',              // RFC 2324
  422 : 'Unprocessable Entity',       // RFC 4918
  423 : 'Locked',                     // RFC 4918
  424 : 'Failed Dependency',          // RFC 4918
  425 : 'Unordered Collection',       // RFC 4918
  426 : 'Upgrade Required',           // RFC 2817
  428 : 'Precondition Required',      // RFC 6585
  429 : 'Too Many Requests',          // RFC 6585
  431 : 'Request Header Fields Too Large',// RFC 6585
  500 : 'Internal Server Error',
  501 : 'Not Implemented',
  502 : 'Bad Gateway',
  503 : 'Service Unavailable',
  504 : 'Gateway Time-out',
  505 : 'HTTP Version Not Supported',
  506 : 'Variant Also Negotiates',    // RFC 2295
  507 : 'Insufficient Storage',       // RFC 4918
  509 : 'Bandwidth Limit Exceeded',
  510 : 'Not Extended',               // RFC 2774
  511 : 'Network Authentication Required' // RFC 6585
};

exports.createServer = function(reqList){
	var server = new Server(reqList);
	return server;
}

exports.ServerResponse = ServerResponse;

exports.IncomingMessage = IncomingMessage;

function Server(reqList){
	events.EventEmitter.call(this); //the server inherits from EventEmitter
    var serverSocket,
		self=this,
		requestCb = reqList;
		
	var timeoutCb = function(socket){
		var endRes = new ServerResponse(socket);
		endRes.writeHead(200,null,{
			'Content-Type': 'text/html;charset=UTF-8',
			'Content-Length': 0,
			'Connection': 'close'
		});
        endRes.end();
		socket.destroy();
	}
	
	this.timeout = 2000;

    this.listen = function(port,host,backlog,callback){
		self.on('request',requestCb);
		self.on('timeout',timeoutCb);
        serverSocket = net.createServer(function(con){
			console.log('New connection from ' +con.remoteAddress +':'+con.remotePort);
			self.emit('connection',con);
            var remainder="",requests;
            con.setKeepAlive(true);
            con.on('data',function(data){
                try{
                    requests = parser.parseIntoReq(remainder+data,con);
                    remainder = requests.remainder;
                    requests.forEach(function(req){
						var res = new ServerResponse(con);
						self.emit('request',req,res);
                    });
                }catch(er){
                    console.log(er.message);
                }
            });
            con.setTimeout(self.timeout,function(){
				self.emit('timeout',con);
            });
            con.on('error', function (conEr) {
                console.log("ignoring exception: " + conEr);
				self.emit('clientError',conEr,con);
				con.end();
                con.destroy();
            });
        });
		
		//start listening:
		if(host == undefined){
			 serverSocket.listen(port);
		}else if(backlog == undefined){
			 serverSocket.listen(port,host);
		}else if(callback == undefined){
			 serverSocket.listen(port,host,backlog);
		}else{
			serverSocket.listen(port,host,backlog,callback);
		}
    }
	
	this.setTimeout =function(msec, callback){
		self.timeout = msec;
		timeoutCb = callback;
	}

    this.close = function(callback){
        console.log('Server shutting down...');
        serverSocket.close(function(){
            console.log('Server closed all connections.');
			self.emit('close');
			if(callback != undefined){
				callback();
			}
        });
    }
}

util.inherits(Server, events.EventEmitter); //the server inherits from EventEmitter