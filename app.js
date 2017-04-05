//Created by Nikhil @2017

var express = require('express')
var engine = require('ejs-locals');
var Docker = require('dockerode');
var bodyparser = require('body-parser');

var docker=new Docker();
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//GLOBALS
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyparser());


//This script should be made a part of docker image in the future
//The scipt is placed outside the image for rapid prototyping (no need to build new docker image during devlopement)
var script = 'echo "Transfering program..."; \
                echo $0 > service.chpl;\
		echo $1 >input.txt;\
                 echo "Compiling program..."; \
                chpl -o service service.chpl;\
		 ./service < input.txt;\
                 echo "Exiting..."';

//HELPER FUNCTIONS
function dockerHelper(socket,code,input) {
//needs to be replaced with a UUID generator
        var containerID = (Math.random() * 7983 +1).toString();

	var runcode = ['sh','-c',script,code,input];

//TTY - needs to be enabled to ensurer UTF8 encoding of stdin,stdout and stderr
//Container contraints such as memory, compute power, etc can we set here
        var optsc = {
  'name':containerID,
  'AttachStdin': false,
  'AttachStdout': true,
  'AttachStderr': true,
  'Tty': true,
  'OpenStdin': false,
  'StdinOnce': false,
  'Cmd': runcode,
  'WorkingDir': '/usr/src',
  'Image': 'chapel/chapel',
  'AutoRemove': true
//  'Memory': 10000,
//  'CpuPeriod':6000000
};

var attachopts = {
        stream: true,
        stdout: true,
        stderr:true
        };


     docker.createContainer(optsc, function (err, container) {
	     container.attach(attachopts, function(err, stream){
	             stream.on('data', (chunk) => {
     	                socket.emit("data",chunk);
                      });
                      stream.on('end', () => {
                        socket.emit("end", '', function(){
				socket.disconnect();
			});
                       });
			container.start();
			container.wait( function(err,data){
				container.remove();
		     	});
                        
                 socket.emit("newID",containerID);
		 
                	});
		});

}


//ROUTE HANDLER FUNCTIONS

function pauseHandler (req,res) {
        var ID = req.body.ID;
        docker.getContainer(ID).pause( function (err){
                if(err)
                         res.status(200).send(false);
                else
                        res.status(200).send(true);
        });

}

function resumeHandler (req,res) {
        var ID = req.body.ID;
        docker.getContainer(ID).unpause( function(err) {
                if(err)
                         res.status(200).send(false);
                else
                        res.status(200).send(true);
        });
}

function stopHandler(req, res) {
	var ID = req.body.ID;
	docker.getContainer(ID).stop().then( function(container){
		return container.remove();
		}).then(function(err) {

			if(err)
        	                 res.status(200).send(false);
                	else
                        	res.status(200).send(true);
        	});
}

//ROUTES
app.get('/',function(resquest, response) {
        response.render('index');
});

//app.post("/",runHandler);
app.post("/pause",pauseHandler);
app.post("/resume",resumeHandler);
app.post("/stop",stopHandler);
//STREAM WeBSOCKET
io.on ("connection", function(socket){
        socket.on("run", function (data){
		    dockerHelper(socket,data.code,data.stdin);	
	});
});
server.listen(3000, function(){
        console.log('Chapel-online listening on port 3000');
});
//Created by Nikhil @2017
//Created by Nikhil @2017
