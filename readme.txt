////////////////////////Ex5 | Web-Server/ToDo | Shlomo Shenzis//////////////////
//////////////////////////////////////////////////////////////////////////////////
The hardest part in this exercise were:
1. Finding a way to parse the chunk in such a way that 
   parsing the body according to content-length would be easy and simple
   as well as working in any situation.
2. The implementation of parsing requests chunked into several messages.
3. Implementing the parameterized routes (/public/:name/).
4. Finiding a model to convert http's req,res into express req,res.

The fun part:
It was a very nice exercise and it was fun writing a WORKING http server on
your own. Seeing the result, as my server (well...) served my ex2 website was
really nice, but seeing it serving dynamic pages and storing data was amazing.

The optimization:
In order to make the server efficient I made a few optimizations:
1)Small files are written to the socket directly (i.e. buffered fully from the 
system, WHEREAS, large files are read in const. chunks from the system and piped
to the socket. This behaviour radically reduces the amount of memory the
server needs to process a request, meaning the server can work under much higher
load!

!!! - You can set the minimum file size for piping by changing MAX_FILE_BUFFER
	  in settings.js - !!!!

2)the parser makes as little as possible
passes over the message as a whole (i.e. no split of the whole message, but
iteration over it.
The server does I/O operations in an asynchronous manner to let the CPU parse the request
non-stop.

3)The server is fully RESTful, by communicating solely by HTTP and not saving any information
about the clients.

The "hacker" handles:
In order to perform a DOS attack on the server by adding handles we could:
1. This function would be started for the directed request and will never end
   not letting other requests be spawned. 
	app.use('/hello/hacker',function(req,res,next){
		while(true){
			console.log('Pwned!');
		}
	});
2. This function, will just terminate the connection to any client sending requests to the server.
	app.use('/hello/hacker',function(req,res,next){
		res.shouldKeepAlive = false;
		res.end();
	});
3.	Other methods could include massive reading/writing to/from filesystem (using fs module)
	finishing the physical memory of the machine or manipulating the filesystem (deleting important files of OS/Server).
	
	To make my handles be executed I would put them first in the stack. This way no other
	handler has the chance to manipulate the request before me and send()/json() ending the execution
	of the stack.

////////////////////////////////////Use Instructions//////////////////////////////////////////
Before running the server you can set preferences in settings.js file.

DIR_INDEX_NAME -  lets you define the webserver directory index file.
The default value is 'index.html'.

MAX_FILE_BUFFER - lets you set the minimum file size to force the webserver 
pipe data in chunks from the disk. (default is 5000 bytes)
 
Running example is given in tester.js
///////////////////////////////////////Notice/////////////////////////////////////////////////
All node's HTTP Server - side API was implemented in the miniHttp module including inheritance 
properties.
////////////////////////////////////Files Included////////////////////////////////////////////
 - root:
miniExpress.js
Request.js
Response.js
Route.js
proto.js
middleware.js
settings.js
load.js
tester.js
NoPartner.txt
readme.txt
doc.html
 -http:
	IncomingMessage.js
	ServerResponse.js
	parser.js
	miniHttp.js
 - www:
	index.html
	jquery-1.10.2.min.map
	jquery-1.10.2.js
	index.js
	style.css
	calculator.js
	photo.jpg
	hapc.jpeg
	grampy.jpg
	prototype.js
	event-loop.txt
	features.txt
	read.txt
//////////////////////////////////////////////////////////////////////////////////////////////
