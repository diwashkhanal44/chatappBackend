var express = require('express');
var router = express.Router();
const viewMessageContoller= require('../controller/viewMessageController');

/* GET home page. */
router.get('/', viewMessageContoller);

module.exports = router;
