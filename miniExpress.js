var proto = require('./proto');
	middleware = require('./middleware'),
	http = require('./http/miniHttp.js');

var exports = module.exports = createApplication;

function createApplication(){
    function app(req,res){app.handle(req,res);};
	merge(app,proto);
	return app;
}

exports.static = middleware.static;
exports.cookieParser = middleware.cookieParser;
exports.json = middleware.json;
exports.urlencoded = middleware.urlencoded;
exports.bodyParser = middleware.bodyParser;

// -------------------------- Utils ------------------------------
function merge(a, b){
	if (a && b) {
		for (var key in b) {
			a[key] = b[key];
		}
	}
  return a;
}