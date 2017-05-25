var User = require('../models/user');
var UserController = require('../controllers/user');
var crypto = require('crypto');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var ConfigAuth = require('../config/auth');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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
                        email: profile.emails[0].value,
                        password: '123456',
                        phone_number:6531314,
                        token:'',
                        //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                        facebook: profile._json
                    });
                    console.log(profile);
                    console.log(user);
                    user.save(function(err) {
                        if (err) console.log(err);
                      //  return res.redirect('/loginPage');
                        return done(err, user);
                    });
                }
                else {
                  //found user. Return
                    console.log('New errr');
                    return done(err, user);
                }
            });
        //  redirect('/');
        }
  ));




    //twitter callbackURL
    exports.twitterCallback = passport.authenticate('twitter',{
        successRedirect: '/api/loginPage',
        failureRedirect: '/api/start'
      }),
      function(req, res) {
        console.log("hello");
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
                            //facebook: profile._json
                        });
                        console.log(profile);
                        console.log(user);
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


//google
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
                            facebook: profile._json
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
