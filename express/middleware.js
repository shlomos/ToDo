var fs = require('fs'),
	qs = require('querystring'),
	pathLib = require('path'),
	settings = require('./settings');

var content = module.exports = {};

content.static = function(rootFolder){
    return function(req,res,next){
		var fullPath,path,endR=(!res.shouldKeepAlive);
        if(req.method === 'GET'){
			path = pathLib.normalize(req.url);
            fullPath = rootFolder+path;
			if(pathLib.extname(fullPath)===''){
                fullPath = fullPath.concat('/'+settings.DIR_INDEX_NAME);
            }
			fullPath = pathLib.normalize(fullPath);
			fs.stat(fullPath, function (err, stats) {
				var stream;
				if(err){
					next();
					/* error = "The resource "+req.path+" was  not found...";
					res.send(404,"<html><head><title>Error</title></head>"+
					"<body><div id='errMsg' style='color:#FF0000'>"+
					error+"</div></body></html>"); */
                }else{
					res.sent = true;
					res.writeHead(200,null,{
						'Content-Type': req.getResourceFormat(),
						'Content-Length': stats.size
					});
					//if the file is very large we pipe him in chunks from the system
					//to the socket, otherwise just fully buffer and send it as a whole.
					if(stats.size<settings.MAX_FILE_BUFFER){
						fs.readFile(fullPath,function(err,data){
							if(err){
								console.log('Could not read file'+err);
							}else{
								res.write(data);
								res.end();
							}
						});
					}
					else{
						stream = fs.createReadStream(fullPath);
						stream.on('error',function(err){
							/*console.log('error piping data.');*/
						});
						stream.on('end',function(){
							//console.log('finished piping.'+fullPath);
						});
						//console.log("piping");
						stream.pipe(res,{ end: endR });
					}
				}
			});
        }else{
			next();
		}
    }
}

content.cookieParser = function(){
	return function(req,res,next){
		req.rawCookies.forEach(function(cookies){
			cookies = cookies.split(';');
			for(var crumb in cookies){
				crumb=cookies[crumb];
				crumb = crumb.split('=');
				if(crumb.length === 2){
					req.cookies[crumb[0]]=crumb[1];
				}else{
					//by definition of RFC do nothing>!
				}
			}
		});
		next();
	}
}

content.json = function(){
	return function(req,res,next){
		if(!req.is('application/json')){
		}else{
			try{
				req.body = JSON.parse(req.body);
			}catch(err){
				console.log(err.message = "Error parsing JSON body"); //ERROR
				next(err);
			}
		}
		next();
	}	
}

content.urlencoded = function(){
	return function(req,res,next){
		if(!req.is('application/x-www-form-urlencoded')){
		}else{
			try{
				req.body = qs.parse(decodeURIComponent(req.body));
			}catch(err){
				console.log(err);
				next(err);
			}
		}
		next();
	}	
}

content.bodyParser = function(){
	var _json = content.json(),
		_urlencoded = content.urlencoded();
	return function bodyParser(req, res, next) {
		_json(req, res, function(err){
		  if (err){
			return next(err);
		  }
			_urlencoded(req, res, next);
		});
	}
}