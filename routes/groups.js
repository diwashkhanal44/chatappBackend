var express = require('express');
var router = express.Router();
const cors=require('cors');
var controller = require('../controller/groupsController');


router.use(cors());

router.get('/',controller.groupListController);
router.post('/creategroup',controller.createGroupController);
router.get('/deletegroup/:groupid',controller.deleteGroupController);
router.get('/eachgroup/:groupId',controller.eachGroupMessageController);
router.post('/adduser',controller.addUserController);
router.post('/postgroupmessages',controller.postGroupMessagesController);



module.exports = router;