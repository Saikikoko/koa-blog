const {Schema} = require('./config');
//设置Schema
const userSchema = new Schema({
    username:String,
    password:String
}, {
    versionKey: false
  })

module.exports = userSchema;
