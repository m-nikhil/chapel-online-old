var stdin = "19281";
//global
var containerID =null;

//helper function
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

//socket init
//sets max reconnection attempts to 5
var socket = io('/',{'reconnectionAttempts':5} );

//sockets ingress
socket.on("newID", function (ID) {
        containerID = ID;
        });

socket.on("data", function(data) {
        $("#output").append(ab2str(data));
});

//closes the socket after receving the output
socket.on("end", function() {
        socket.close();
        $("#pause").prop('disabled',true);
	$("#run").prop('disabled',false);
	$("#resume").prop('disabled',true);
	$("#stop").prop('disabled',true);
});

//Updates user about connection failures
socket.on("reconnect_failed", function() {
        $("#output").append("\n connection to the server failed");
        $("#pause").prop('disabled',true);
        $("#resume").prop('disabled',true);
	$("#run").prop('disabled',false);
	$("#stop").prop('disabled',true);
});

//resume container
function resume(){
$.post("/resume",{'ID':containerID}, function(data){

//enabing pause button and disabling resume button upon success
if(data == true)
        {
                $("#pause").prop('disabled', false);
                $("#resume").prop("disabled",true);
		$("#run").prop('disabled', true);
		$("#stop").prop('disabled',false);
        }
  });
}

//Pause container

function pause(){
$.post("/pause",{'ID':containerID}, function(data){
       //enabling resume button and disabling pause button upon success
 if( data == true)
        {
                $("#pause").prop('disabled', true);
                $("#resume").prop("disabled",false);
		$("#run").prop('disabled', true);
		$("#stop").prop('disabled', true);
        }
  });
}

function stop() {
$.post("/stop",{'ID':containerID}, function(data){
	//toggle buttons
  if( data == true)
        {
                $("#pause").prop('disabled', true);
                $("#resume").prop("disabled",true);
		$("#stop").prop('disabled', true);
		$("#run").prop('disabled', false);
        }
  });
}

$( document ).ready(function() {


 // splitter panel
 $(".panel-left").resizable({
   handleSelector: ".splitter",
   resizeHeight: false
 });

 $(".panel-top").resizable({
   handleSelector: ".splitter-horizontal",
   resizeWidth: false
 });

 //editor
 var editor = ace.edit("editor");
 editor.setTheme("ace/theme/monokai");
 editor.getSession().setMode("ace/mode/javascript");
 editor.setOptions({
    fontSize: "13pt"
  });

 $("#run").click(function () {

        $("#output").empty();
 //diabling resume button and enabling pause button
        $("#pause").prop('disabled', false);
        $("#resume").prop("disabled",true);
	$("#run").prop("disabled",true);
	$("#stop").prop("disabled",false);

 //fetch code from editor
 var code =  editor.getValue();
 var stdin = $("#input").val();
console.log(stdin);
// reconnects the socket
if (socket.connected == false)
        socket.connect();
 socket.emit("run",{'ID': containerID,'code':code,'stdin':stdin});
  });



});
