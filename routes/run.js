
"use strict";

var express = require('express');
var router = express.Router()
var bodyparser = require('body-parser');

var urlencodedparser = bodyparser.urlencoded({ extended: false })

router.route('/')
.post(urlencodedparser,function (request, response) {


});

module.exports = router;
