var express = require('express');
var router = express.Router();

router.route('/')
  .get(function(resquest, response) {
        response.render('index');
  });



module.exports = router;
