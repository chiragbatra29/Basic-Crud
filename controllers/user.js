var User = require('../models/user');
var UserController = require('../controllers/user');
var crypto = require('crypto');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var ConfigAuth = require('../config/auth');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Validator = require('../config/validators')
//for message
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "13f17fb4",
  apiSecret: "c323bad7f9809f68"
});


//getUsers
exports.getAllUsers = function(req, res, next){
  nexmo.message.sendSms(
  9999999999, '919034020408', 'welcome',
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        res.send(responseData);
      }
    }
 );

  User.find({}, function(err, users){
    if(err){
      res.status(401);
      res.send(err);
    }else if (users) {
        res.status(200);
        res.send(users);
    }
  })
}


//Start the crud(signup Page)
exports.startCrud = function(req, res, next){
  res.sendFile('/home/user/Desktop/Basic-Crud'+'/Pages/signup.html')
}


//display login Page
exports.loginPage = function(req, res, next){
  res.sendFile('/home/user/Desktop/Basic-Crud'+'/Pages/login.html')
}


//display forgot password page
exports.forgotPasswordPage = function(req, res, next){
  res.sendFile('/home/user/Desktop/Basic-Crud'+'/Pages/forgotPw.html')
}


//display resetPassword page
exports.resetPasswordPage = function(req, res, next){
  var Token = req.query.token;
  // console.log(Token);
  var newpass = req.body.newpass;
  var newpassconfirm = req.body.newpassconfirm;
  res.sendFile('/home/user/Desktop/Basic-Crud'+'/Pages/resetPw.html')
}


//registerNewUser
exports.newUser = function(req, res, next){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phone_number;
    var imgName = req.files[0]['filename'];
    var img = "http://localhost:3000/api/images/" + imgName;

    var newuser = new User();
    newuser.name = name;
    newuser.email = email;
    newuser.password = password;
    newuser.phone_number = phone_number;
    newuser.img = img;
    newuser.token = "";
    //console.log(newuser);
    newuser.save(function(err, savedUsed){
      if(err){
        console.log(err);
        return res.status(500).send();
      }
      return res.status(200).send();
    });
     res.sendFile('/home/user/Desktop/Basic-Crud'+'/Pages/login.html');
}


//login
exports.login = function(req, res) {
  var Name = req.body.name;
  var Email = req.body.email;
  var Password = req.body.password;
  User.findOne({
    name: Name,
    email: Email,
    password: Password
  }, function(err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!user) {
      return res.status(400).send("User Not Exist " + " name:" + Name + "  email:" + Email);
    }
    console.log(user);
    return res.status(200).send(user);
  })
}



//forgotPassword
exports.forgotPassword = function(req, res) {  var Name = req.body.name;
  var Email = req.body.email;
  var n = Email.indexOf("@");
  var unix = Math.round(+new Date()/1000);
  //encryption
  var data = Name+Email.substring(0, n)+"unix";
  var Token = crypto.createHash('md5').update(data).digest("hex");

  User.findOneAndUpdate({email: Email}, {token:Token}, function(err, user){
     if(err){
       console.log(err);
       return res.status(500).send();
     }
     if(!user){
       return res.status(400).send("User Not Exist "+" name:"+Name+"  email:" +Email );
     }
     return res.status(200).send(user);
   })

  console.log('sending email');

  var send = require('gmail-send')({
    user: 'chiragbatra1994@gmail.com',
    pass: 'hellochirag123',
    to:   '"User" <batrachirag1994@gmail.com>',
    subject: 'Forget Password Mail',
    text:    "http://localhost:3000/api/setPass?token="+Token
  });

  send({
    subject: 'Forget Password Mail'
  }, function (err, res) {
    console.log('email sent');
  });
}


//ChangePassword
exports.changePassword = function(req, res, next){
  var Token = req.body.token;
  var newpass = req.body.newpass;
  var newpassconfirm = req.body.newpassconfirm;
  //console.log(Token);
  if (newpass !== newpassconfirm) {
     throw new Error('password and confirm password do not match');
  }
  User.findOneAndUpdate({token:Token}, {password:newpass}, function(err, user){
     if(err){
       console.log(err);
       return res.status(500).send();
     }
     if(!user){
       return res.status(400).send("User Not Exist ");
     }
     return res.status(200).send("Password Changed succesfully");
   })
}


exports.profile = function(req, res, next){
  var user = req.query.user;
  // console.log(user);
  res.sendFile('/home/user/Desktop/Basic-Crud'+'/Pages/profile.html');
  }


// exports.userData = function(req, res, next){
//   var user = req.query.user;
//   res.sendFile('/home/user/Desktop/Basic-Crud'+'/Pages/profile.html');
// }

//facebook callbackURL
exports.fbCallback = passport.authenticate('facebook',{
    successRedirect: '/api/loginPage',
    failureRedirect: '/api/start'
  }),
  function(req, res) {
    res.redirect('/');
  }

//facebook
exports.facebook =  passport.authenticate('facebook', {scope: ['email']},
  {successRedirect: '/api/loginPage',
    failureRedirect: '/api/start'
}),
passport.use(new FacebookStrategy({
    clientID: ConfigAuth.facebookAuth.clientID,
    clientSecret: ConfigAuth.facebookAuth.clientSecret ,
    callbackURL: ConfigAuth.facebookAuth.callbackURL,
    profileFields:ConfigAuth.facebookAuth.profileFields
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('callback');
    User.findOne({'facebook.id': profile.id}, function(res,err, user) {
                if (err) {
                  console.log(err);
                  return done(err);
                }
               //No user was found... so create a new user with values from Facebook (all the profile. stuff)
                if (!user) {
                    var user = new User({
                        name: profile.displayName,
                        email: "ds@gmail.com",
                        password: '123456',
                        phone_number:6531314,
                        token:'',
                        //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                        facebook: profile._json
                    });
                    // console.log(profile);
                    // console.log(user);
                    user.save(function(err) {
                        if (err) console.log(err);
                        return res.redirect('/loginPage');
                        // return done(err, user);
                    });
                }
                else {
                  //found user. Return
                    console.log('New errr');
                    return done(err, user);
                }
            });
        }
  ));


//twitter callbackURL
exports.twitterCallback = passport.authenticate('twitter',{
        successRedirect: '/api/loginPage',
        failureRedirect: '/api/start'
      }),
      function(req, res) {
        // console.log("hello");
        res.redirect('/');
      }

//twitter authenticate
exports.twitter =  passport.authenticate('twitter', {scope: ['email']},
      {successRedirect: '/api/loginPage',
        failureRedirect: '/api/start'
    }),
  passport.use(new TwitterStrategy({
          consumerKey: ConfigAuth.twitterAuth.consumerKey,
          consumerSecret: ConfigAuth.twitterAuth.consumerSecret,
          callbackURL: "http://www.example.com/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, done) {
          console.log('callback');
          User.findOne({'twitter.id': profile.id}, function(err, user) {
                      if (err) {
                        console.log(err);
                        return done(err);
                      }
                     //No user was found... so create a new user with values from Facebook (all the profile. stuff)
                      if (!user) {
                          var user = new User({
                              name: profile.displayName,
                              email: "profile.email",
                              password: '123456',
                              phone_number:6531314,
                              token:'',
                              //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                              twitter: profile._json
                          });
                          // console.log(profile);
                          // console.log(user);
                          user.save(function(err) {
                              if (err) console.log(err);
                              return done(err, user);
                          });
                      }
                      else {
                          console.log('New errr');
                          return done(err, user);
                      }
                  });
                }
        ));


//googleCallbackURL
exports.googleCallback = passport.authenticate('google',{
        successRedirect: '/api/loginPage',
        failureRedirect: '/api/start'
      }),
      function(req, res) {
        res.redirect('/');
      }

//google
exports.google =  passport.authenticate('google', {scope: ['profile','email']},
      {successRedirect: '/api/loginPage',
        failureRedirect: '/api/start'
    }),
passport.use(new GoogleStrategy({
        clientID: ConfigAuth.googleAuth.clientID,
        clientSecret: ConfigAuth.googleAuth.clientSecret ,
        callbackURL: ConfigAuth.googleAuth.callbackURL,
        profileFields:ConfigAuth.googleAuth.profileFields
      },
      function(accessToken, refreshToken, profile, done) {
        console.log('callback');
        User.findOne({'google.id': profile.id}, function(res,err, user) {
                    if (err) {
                      console.log(err);
                      alert('User Already Exist');
                      return done(err);
                    }
                   //No user was found... so create a new user with values from Facebook (all the profile. stuff)
                    if (!user) {
                        var user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            password: '123456',
                            phone_number:6531314,
                            token:'',
                            //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                            google: profile._json
                        });
                        console.log(profile);
                        console.log(user);
                        user.save(function(err) {
                            if (err) console.log(err);
                            //return done(err, user);
                        });
                    }
                    else {
                        console.log('New errr');
                        //return done(err, user);
                    }
                });
            }
      ));
