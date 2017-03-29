var express = require('express');
var router = express.Router()
var bodyparser = require('body-parser');

var urlencodedparser = bodyparser.urlencoded({ extended: false })

router.route('/')
.post(urlencodedparser,function (request, response) {

var tmp = require('tmp'),
    fs   = require('fs'),
    spawn = require('child_process').spawn,
    path = require('path'),
    exec = require('child_process').exec;

//data from editor
 var code = response.body;
 console.log(code);


 tmp.tmpName({ template: path.join(path.dirname(__dirname),'tmp','tmp-XXXXXX.chpl') }, function _tempNameGenerated(err, pathname) {
    if (err) throw err;


   fs.writeFile(pathname,  'data', (err) => {
   if (err) throw err;
   });

    //compile and execute

  var exe = path.format({ root: './tmp/',
                           name: path.basename(pathname),
                           ext: '_exe'});


  var compile = spawn('chpl',['-o',exe,'./tmp/hello.chpl']);

  compile.stderr.on('data', function (data) {
    console.log(String(data));      //stream to output textarea
  });

   compile.on('close', function (data) {
    if (data === 0) {
        var run = spawn(exe, []);

        run.stdout.on('data', function (output) {
            console.log(String(output));
        });

        run.stderr.on('data', function (output) {
            console.log(String(output));
        });
           
       
    }
    });


 

});

response.sendStatus(200);

});
module.exports = router;
