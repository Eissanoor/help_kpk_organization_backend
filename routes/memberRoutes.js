const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.post('/addnewmember', memberController.addNewMember);
router.get('/getmember', memberController.getMember);

module.exports = router;