var miniHttp = require('./http/miniHttp.js');

var res = exports = module.exports = {
  __proto__: miniHttp.ServerResponse.prototype
};

res.sent = false;

res.status = function(statusCode){
	this.statusCode = statusCode;
	return this;
}

res.set = function(field,value){
	if(arguments.length === 1){
		if('object' == typeof field){
			this.writeHead(this.statusCode,null,field);
		}
	}else{
		if('string' == typeof field){
			this.setHeader(field,value);
		}
	}
}

res.get = function(field){
	return this.getHeader(field);
}

res.cookie = function(name,value,options){
	var cookieJar;
	name = name.toLowerCase();
	try{
		cookieJar = name+"="+(('string' == typeof value)?value:JSON.stringify(value))+';';
		if(options != undefined){
			optionsKeys = Object.keys(options);
			if(options['domain'] != undefined){
				cookieJar = cookieJar + 'Domain=' + options['domain']+';';
			}
			if(options['path'] != undefined){
				cookieJar = cookieJar + 'Path=/;';
			}else{
				cookieJar = cookieJar + 'Path: / ;';
			}
			if(options['expires'] != undefined){
				cookieJar = cookieJar + 'Expires='+options['expires']+';';
			}
			if(options['maxAge'] != undefined){
				cookieJar = cookieJar + 'Expires='+(new Date(Date.now() + (1*options['maxAge'])))+';';
			}
			if(options['secure'] === true){
				cookieJar = cookieJar + 'Secure;';
			}
			if(options['httpOnly'] === true){
				cookieJar = cookieJar + 'HttpOnly';
			} 
		}
		this.setHeader('set-cookie',cookieJar);
	}catch(er){
		console.log(er);
	}
}

res.send = function(status,body){
	this.sent = true;
	if(body != undefined){
		this.status(status);
	}
	else{
		body = status;
		if('number' == typeof body){
			this.set('content-length',0);
			this.status(body);
			this.write();
			return;
		}
	}
	this.set('content-length',Buffer.byteLength(body));
	if('string' == typeof body){
		if(!this.get('content-type')){
			this.set('content-type','text/html');
		}
		this.write(body);
	}else if('object' == typeof body || 'boolean' == typeof body){
		if(Buffer.isBuffer(body)){
			if(!this.get('content-type')){
				this.set('content-type','application/octet-stream');
			}
			this.write(body);
		}else{
			if(!this.get('content-type')){
				this.set('content-type','application/json');
			}
			this.write(JSON.stringify(body));
		}
		this.end();
	}
}

res.json = function(status,body){
	if(arguments.length == 1){
		body = status;
	}else{
		this.status(status);
	}
	// JSON doesn't support undefined.
	if(body == undefined){
		body = 'undefined';
	}else{
		body = JSON.stringify(body);
	}
	this.set('content-type','application/json');
	this.send(body);
}