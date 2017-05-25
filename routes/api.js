var express = require('express');
var router = express.Router();
var User = require('../models/user');
var userController = require('../controllers/user');
var crypto = require('crypto');
var passport = require('passport');
var multer = require('multer');
// var upload = multer({
//   dest: './public/images/',
//   rename: function (fieldname, filename) {
//     console.log("Rename...");
//     return filename + ".jpg";
//   }
// });

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + ".jpg")
  }
});

var upload = multer({
  storage: storage
})
//to send Files
router.use(express.static('public'));
router.use(express.static('forgotPW/src'));
router.use(express.static('ResetPW/src'));
// router.use(express.static('images'));

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
//upload.any() Accepts all files that comes over the wire. An array of files will be stored in req.files.
router.route('/register').post(upload.any(), userController.newUser);


//forgot password
router.route('/fpass').post(userController.forgotPassword);


//ChangePassword
router.route('/changePass').post(userController.changePassword);


//show user data
router.route('/profile').get(userController.profile);


//facebook authenticate
router.route('/auth/facebook').get(userController.facebook);

//facebook callback
router.route('/auth/facebook/callback').get(userController.fbCallback);


//twitter authenticate
router.route('/auth/twitter').get(userController.twitter);

//twitter callback
router.route('/auth/twitter/callback').get(userController.twitterCallback);


//google authenticate
router.route('/auth/google').get(userController.google);

//google callback
router.route('/auth/google/callback').get(userController.googleCallback);



// router.route('/userData').get(userController.userData);


passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
})

User.methods(['get', 'put', 'post', 'delete']);
User.register(router, '/');

module.exports = router;
