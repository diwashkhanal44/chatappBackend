var express = require('express');
const usersController  = require('../controller/userController');
var router = express.Router();


router.get('/', usersController);

module.exports = router;
