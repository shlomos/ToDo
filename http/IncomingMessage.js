var pathLib = require('path');
	urlLib = require('url'),
	util = require('util'),
	events = require('events'),
	settings = require('./../settings');

var exports = module.exports = IncomingMessage;

function IncomingMessage(con){
	events.EventEmitter.call(this); // inherits from EventEmitter
    var self = this;
	this.socket = con;
    this.method = null;
	this.url = null;
	this.originalUrl = null;
    this.protocol = null;
	this.httpVersion = null;
	this.headers = {};
	this.trailers = {}; //should not be implemented.
    this.keepAlive = true;
    this.body=null;
    this.error=null;
    this.contentLength = 0;
	this.cookies = {};
	this.rawCookies=[];

    this.setMethod = function(meth){
        if(isLegalRequest(meth)){
            self.method = meth;
            return true;
        }else{
            self.setError("Illegal Request Method "+meth+".");
            return false;
        }
    }

    this.setPath = function(pth){
        if(pth != undefined && pth != null && pth!==''){
			self.url = self.originalUrl = pth;
            return true;
        }else{
            self.setError("Illegal Request Path "+pth+".");
            return false;
        }
    }

    this.setProtocol = function(pcl){
		var pclParts,version;
        if(pcl != undefined && pcl != null){
			pclParts = pcl.split('/');
			if(pclParts[0] === 'HTTP'){
				version = pclParts[1]*1;
				self.httpVersion = version;
				if(version === 1.0 || version === 1.1){
					self.protocol = pcl;
					if(version === 1.0){
						self.keepAlive = false;
					}
					return true;
				}
			}
        }
        self.setError("Illegal Request Protocol "+pcl+".");
        return false;
        
    }

    this.setKeepAlive = function(ka){
        if(ka === 'KEEP-ALIVE'){
            self.keepAlive = true;
        }else if(ka === 'CLOSE'){
            self.keepAlive = false;
        }else{
            self.setError("Illegal Connection Argument "+ka+".");
            return false;
        }
        return true;
    }

    this.setContentLength = function(len){
        if(!isNaN(len*1) && len!==''){
            self.contentLength = len*1;
            return true;
        }else{
            self.setError("Illegal Body Length "+len+".");
            return false;
        }
    }

    this.setBody = function(body){
        self.body=body;
    }

    this.setError = function(error){
        //Always first error:
        if(self.error === null){
            self.error = error;
        }
    }

    this.getResourceFormat = function(){
        var format = pathLib.extname(self.path).toLowerCase();
        if(format === '.html'){
            return 'text/html;charset=UTF-8';
        }
        else if(format === '.jpg' || format === '.jpeg'){
            return 'image/jpeg';
        }
		else if(format === '.png'){
            return 'image/png';
        }
        else if(format === '.js'){
            return 'application/javascript';
        }
        else if(format === '.css'){
            return 'text/css';
        }
        else if(format === '.gif'){
            return 'image/gif';
        }
        else if(format === '.txt'){
            return 'text/plain';
        }
		else if(format === '.ico'){
            return 'image/x-icon';
        }
        else{
            return 'text/html';
        }
    }
    
	this.setTimeout = function(msec,callback){
		if(self.socket != null){
			self.socket.setTimeout(msec,callback);
		}
	}
}

util.inherits(IncomingMessage, events.EventEmitter); //inherits from EventEmitter

var isLegalRequest = function(req){
	var reqs = ['GET','POST','PUT','DELETE','OPTIONS','TRACE','CONNECT','HEAD'];
	for(var i=0;i<reqs.length;i++){
		if(req===reqs[i]){
			if(i>3){
				self.setError(reqs[i] +" is unsupported");
				self.error.status = 405;
			}
			return true;
		}
	}
	return false;
}