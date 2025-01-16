const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../auth/userauth');
// const upload = multer({ storage: storage });
const apicache = require('apicache');
const cache = apicache.middleware;

// cache('5 minutes'),

router.post('/login', userController.loginUser);
router.put('/password_change/:id', userController.changePassword)
router.get('/', cache('60 minutes'), userController.getUsers)
router.post('/', userController.addUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', cache('60 minutes'), userController.getUserById)
router.put('/:id', userController.updateUser)
module.exports = router;