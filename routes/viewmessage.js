var express = require('express');
var router = express.Router();
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const viewMessageContoller= require('../controller/viewMessageController');

/* GET home page. */
router.get('/', viewMessageContoller);

module.exports = router;
