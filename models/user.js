var restful = require('node-restful');
var mongoose = restful.mongoose;
var autoIncrement = require('mongoose-auto-increment');


var userSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone_number: { type: Number, unique: false, required: true },
  img:  String,
  token: String,
  facebook: {type: Array, unique:true},
  google: {type: Array, unique:true},
  twitter: {type: Array, unique:true},
  created_at: {type: Date, default: Date.now}
});


//for auto increment id
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: '_id',
    startAt: 1,
    incrementBy:1
});
var User = restful.model('User', userSchema);
module.exports = User;
