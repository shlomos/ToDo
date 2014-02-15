var http = require('./http/miniHttp'),
	requset = require('./Request'),
	response = require('./Response'),
	Route = require('./Route'),
	pathLib = require('path');

var app = module.exports = {};

app.routes = {};

app.stack = [];	

app._use = function(rootResource,fn,verb){
	var stackObj;
	// default route to '/'
	if ('string' != typeof rootResource) {
		fn = rootResource;
		rootResource = '/';
	}
	stackObj = new Route((verb == undefined)?verb:verb.toUpperCase(),rootResource,fn,{sensetive:false,strict:false});
	this.stack.push(stackObj);
	if(verb != undefined){
		if(this.routes[verb] == undefined){
			this.routes[verb] = [];
		}
		this.routes[verb].push(stackObj);
	}
};

app.use = function(rootResource,fn){
	app._use(rootResource,fn);
};

app.get = function(rootResource,fn){
	app._use(rootResource,fn,'get');
}

app.post = function(rootResource,fn){
	app._use(rootResource,fn,'post');
}

app.put = function(rootResource,fn){
	app._use(rootResource,fn,'put');
}

app.delete = function(rootResource,fn){
	app._use(rootResource,fn,'delete');
}

app.handle = function(req,res){
	//Translate Req,Res into our type:
	req.__proto__=requset;
	res.__proto__=response;
	res.shouldKeepAlive = req.keepAlive;
	//-----
	var stack = this.stack,
		notRouted = false,
		error,
		level = 0;
	var next = function(err){
		if(err){
			console.log(err.message);
			res.send(500 || err.status,err.message);
		}else if(level >= stack.length){
			if(res.sent === false){
			res.shouldKeepAlive = req.keepAlive;
			error = "The resource "+req.path+" was  not found...";
			res.send(404,"<html><head><title>Error</title></head>"+
			"<body><div id='errMsg' style='color:#FF0000'>"+
			error+"</div></body></html>");
		}
		}else{
			try{
				if(stack[level].match(req.path)){ 
					if (req.method===stack[level].method || stack[level].method == undefined){
						req.params = stack[level].params;
						req.url = req.originalUrl.replace(stack[level].regexp,'/');
						(stack[level++]).app(req,res,next);;
					}else{
						level++;
						next();
					}
				}else{
					level++;
					next();
				}
			}catch(err){
				next(err);
			}
		}
	}
	if(req.error !== null){
		error = "Failed parsing the request: "+req.error;
		if(req.error.status){
			res.set('Allow','GET, POST, PUT, DELETE');
			res.send(req.error.status,"<html><head><title>Error</title></head>"+
					"<body><div id='errMsg' style='color:#FF0000'>"+
					error+"</div></body></html>");
		}else{
			res.send(500,"<html><head><title>Error</title></head>"+
				"<body><div id='errMsg' style='color:#FF0000'>"+
				error+"</div></body></html>");
		}
	}else if(req.get('host') == undefined){
		res.shouldKeepAlive = req.keepAlive;
		error = "No host specified!";
		res.send(400,"<html><head><title>Error</title></head>"+
			"<body><div id='errMsg' style='color:#FF0000'>"+
			error+"</div></body></html>");
	}else{
		next();
	}
};

app.listen = function(port,host,backlog,callback){
	var server = http.createServer(this);
	return server.listen(port,host,backlog,callback);
};

//Old Iteration Method.
/* for(var i = 0;i<stack.length;i++){
			try{
				if(stack[i].match(req.path) && (req.method===stack[i].method || stack[i].method == undefined)){
					req.params = stack[i].params;
					req.url = req.originalUrl.replace(stack[i].regexp,'/');
					(stack[i]).app(req,res,next);
				}
			}catch(err){
				next(err);
			}
		} */
		//End



