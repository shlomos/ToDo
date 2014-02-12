var IncomingMessage = require('./IncomingMessage.js');
var query = require('querystring');

var exports = module.exports;

var normalizeLine = function(line){
    line = line.replace(/\s+/g, ' ');
    line=line.trim();
    return line;
}

exports.parseIntoReq = function(data,con){
    var requests = [];
    requests.remainder = "";
    var success,reqLine;
    var temp = data.toString(),tempReq="",lines;
	//console.log(temp); //DBG
    var sep = temp.indexOf("\r\n\r\n");
	var i,hdrName,req;
    while(sep !== (-1)){
        req = new IncomingMessage(con);
        success = true;
        tempReq = temp.substring(0,sep);
        temp = temp.substring(sep+4);
        //parse the request:
        lines = tempReq.split("\r\n");
        i = 0;
        if(lines[0] === ''){i++;}
        reqLine = normalizeLine(lines[i]).split(' ');
        success = req.setMethod(reqLine[0]);
        success = req.setPath(reqLine[1]);
        success = req.setProtocol(reqLine[2].toUpperCase());
        for(i=i+1;i<lines.length;i++){
            reqLine = normalizeLine(lines[i]).split(/:(.+)?/);
			if(reqLine[0].trim() != undefined){
				reqLine[1]=reqLine[1].trim();
				hdrName = reqLine[0].toUpperCase();
				switch(hdrName){
					case 'CONNECTION':
						success = req.setKeepAlive(reqLine[1].toUpperCase());
						break;
					case 'CONTENT-LENGTH':
						success = req.setContentLength(reqLine[1]);
						break;
					case 'COOKIE':
						req.rawCookies.push(reqLine[1]);
						break;
				}
				req.headers[reqLine[0].toLowerCase()]=reqLine[1];
			}	
        }
        if(req.contentLength > temp.length && success===true){
            sep = -1;
            requests.remainder = tempReq+"\r\n\r\n"+temp;
            return requests;
        }
        if(success === true){
            req.setBody(temp.substring(0,req.contentLength));
            temp = temp.substring(req.contentLength);
        }
        requests.push(req);
        //end
        sep = temp.indexOf("\r\n\r\n");
    }
    requests.remainder = temp;
    return requests;
}