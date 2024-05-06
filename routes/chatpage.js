var express = require('express');
var router = express.Router();
const cors=require('cors');
var chatpageController = require('../controller/chatpageController.js');


router.use(cors());

router.post('/', chatpageController);
router.get('/',chatpageController);



module.exports = router;