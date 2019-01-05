const {Schema} = require('./config');
//设置Schema
const UserSchema = new Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: "/avatar/default.jpg"
    }
}, {
    versionKey: false
  })

module.exports = UserSchema;
