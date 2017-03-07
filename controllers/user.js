var User = require('../models/user');
var UserController = require('../controllers/user');
var crypto = require('crypto');


//getUsers
exports.getAllUsers = function(req, res, next){
  res.render('index', { title: 'Express' })
}


//Start the crud(signup Page)
exports.startCrud = function(req, res, next){
  res.sendFile('/home/user/Desktop/chirag'+'/Pages/signup.html')
}


//display login Page
exports.loginPage = function(req, res, next){
  res.sendFile('/home/user/Desktop/chirag'+'/Pages/login.html')
}


//forgot password page
exports.forgotPasswordPage = function(req, res, next){
  res.sendFile('/home/user/Desktop/chirag'+'/Pages/forgotPw.html')
}


//resetPassword page
exports.resetPasswordPage = function(req, res, next){
  var Token = req.query.token;
  console.log(Token);
  var newpass = req.body.newpass;
  var newpassconfirm = req.body.newpassconfirm;
  res.sendFile('/home/user/Desktop/chirag'+'/Pages/resetPw.html')
}


//registerNewUser
exports.newUser = function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var phone_number = req.body.phone_number;

  var newuser = new User();
  newuser.name = name;
  newuser.email = email;
  newuser.password = password;
  newuser.phone_number = phone_number;
  newuser.token = "";
  newuser.save(function(err, savedUsed){
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  });
}


//login
exports.login = function(req, res){
  var Name = req.body.name;
  var Email = req.body.email;
  var Password = req.body.password;
 User.findOne({ name: Name, email: Email, password: Password}, function(err, user){
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    if(!user){
      return res.status(400).send("User Not Exist "+" name:"+Name+"  email:" +Email );
    }
    console.log('hi');
    return res.status(200).send(user);
  })
}


//forgotPassword
exports.forgotPassword = function(req, res){
  var Name = req.body.name;
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
