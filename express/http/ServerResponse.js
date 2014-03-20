var util = require('util'),
	http = require('./miniHttp.js');
	stream = require('stream'),
	events = require('events'),
	Writable = stream.Writable;

module.exports = ServerResponse;

function ServerResponse(con,options){
	events.EventEmitter.call(this); // inherits from EventEmitter
	var self = this,
		finished = true;
	
	Writable.call(this, options);
	this.headers = {};
	this.headersSent = false;
	this.sendDate = true;
	this.statusCode = 200;
	this.reasonPhrase;
	this.shouldKeepAlive = true;
	
	this.write = function(data, encoding){ //Do encodeing option
		var header,array;
		try{
			if(finished){
				header='HTTP/1.1 '+self.statusCode+' '+(self.reasonPhrase || http.STATUS_CODES[self.statusCode])+'\r\n';
				if(self.sendDate){
					self.setHeader('Date',(new Date()).toUTCString());
				}
				self.setHeader('Server','miniExpress 0.1a (by Shlomo Shenzis)');
				heads = Object.keys(self.headers);
				for(var i=0;i<heads.length;i++){
					if(util.isArray(self.headers[heads[i]])){
						array = self.headers[heads[i]];
						for(var j=0;j<array.length;j++){
							header=header+heads[i]+': '+array[j]+'\r\n';
						}
					}else{
						header=header+heads[i]+': '+self.headers[heads[i]]+'\r\n';
					}
				}
				con.write(header+'\r\n');
				self.headersSent = true;
				finished = false;
			}
            if(data !== null && data!=undefined){
                con.write(data, encoding);
            }
        }catch(er){
            console.log(er.message);
        }
        self.headers = {};
		self.reasonPhrase = undefined;
	}
	
	this.writeHead = function(statusCode,reasonPhrase,headers){
		var heads;
		self.statusCode = statusCode;
		if(arguments.length > 1 && reasonPhrase == typeof 'string'){
			self.reasonPhrase = reasonPhrase;
		}else if(arguments.length == 2 && reasonPhrase == typeof 'object'){
			headers = reasonPhrase;
		}
		if(headers != undefined && headers != null){
			heads = Object.keys(headers);
			for(var i=0;i<heads.length;i++){
				self.setHeader(heads[i],headers[heads[i]]);
			}
		}
	}

    this.end = function(data, encoding){
		finished = true;
		self.headersSent = false;
		self.emit('finish');
		if(!self.shouldKeepAlive){
			if(data != null && data != undefined){
				con.end(data, encoding);
			}else{
				con.end();
			}
		}else{
			if(data != null && data != undefined){
				con.write(data);
			}
		}
    }
	
	this.setTimeout = function(msec,callback){
		con.setTimeout(msec);
		if(callback != undefined){
			con.on('timeout',callback);
		}
	}
	
	this.setHeader = function(name,value){
		if(name === 'set-cookie'){
			if(self.headers[name] == undefined){
				self.headers[name] = [value];
			}else{
				self.headers[name].push(value);
			}
		}else{
			self.headers[name] = value;
		}
    }
	
	this.getHeader = function(name){
		return self.headers[name.toLowerCase()];
	}
	
	this.removeHeader = function(name){
		delete self.headers[name];
	}
	
	this.addTrailers = function(headers){
		//Should not be implemented.
	}
}
util.inherits(ServerResponse, Writable);
util.inherits(ServerResponse, events.EventEmitter); //inherits from EventEmitter
