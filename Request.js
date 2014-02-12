var miniHttp = require('./http/miniHttp.js'),
	urlLib = require('url');

var req = exports = module.exports = {
  __proto__: miniHttp.IncomingMessage
};

req.params={};

req.__defineGetter__('protocol', function(){
  return 'http';
});

req.__defineGetter__('query',function(){
	var url = this.url;
	url = urlLib.parse(url,true);
	return url.query;
});

req.__defineGetter__('path',function(){
	var url = this.url;
	url = urlLib.parse(url,true);
	return url.pathname;
});

req.__defineGetter__('host',function(){
	var host = this.host;
	host = urlLib.parse(host,true);
	return url.hostname;
});

req.get = function(field){
	field = field.toLowerCase();
	return this.headers[field];
}

req.is = function(mime){
	if(this.get('content-type') == undefined){
		return false;
	}
	mime = mime.split('/');
	//avoid the char-set property. 
	cT = (this.get('content-type').split(';'))[0];
	cT = cT.split('/');
	if(mime.length === 1){
		if(mime[0] === cT[1]) return true;
		return false;
	}else{
		if(mime[0] === cT[0]){
			if(mime[1] === cT[1] || mime[1]==='*'){
				return true;
			}
		}
	}
	return false;
}

req.param = function(name){
	if(this.params[name] != undefined){
		return this.params[name];
	}else if(this.body[name] != undefined){
		return this.body[name];
	}else{
		return this.query[name];
	}
}




