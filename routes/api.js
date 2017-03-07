var express = require('express');
var router = express.Router();
var User = require('../models/user');
var userController = require('../controllers/user');
var crypto = require('crypto');


//to send Files
router.use(express.static('public'));
router.use(express.static('forgotPW/src'));
router.use(express.static('ResetPW/src'));


//getUser
router.route('/get').get(userController.getAllUsers);


//Start the crud(signup Page)
router.route('/start').get(userController.startCrud);


//login Page
router.route('/loginPage').get(userController.loginPage);


//forgot password page
router.route('/forgot').get(userController.forgotPasswordPage);


//resetPassword page
router.route('/setPass').get(userController.resetPasswordPage);


//loginUser
router.route('/login').post(userController.login);


//registerNewUser
router.route('/register').post(userController.newUser);


//forgot password
router.route('/fpass').post(userController.forgotPassword);


//ChangePassword
router.route('/changePass').post(userController.changePassword);


User.methods(['get', 'put', 'post', 'delete']);
User.register(router, '/');

module.exports = router;
