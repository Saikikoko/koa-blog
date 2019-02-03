const {Schema} = require('./config');
//设置Schema
const UserSchema = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        default: 1
    },
    avatar: {
        type: String,
        default: "/avatar/default.jpg"
    },
    articleNum: Number,
    commentNum: Number
}, 
  {versionKey: false}
)


UserSchema.post("remove", (doc) => {
  // 当前这个回调函数  一定会在 remove 事件执行触发
  const Article = require('../Models/article')
  const Comment = require('../Models/comment')

  const {_id:authorID} = doc
  // 删除对应文章 
  Article.find({author: authorID})
  .then(data => {
    data.forEach(v => v.remove())
  })

  //删除对应评论
  Comment.find({from: authorID})
  .then(data => {
    data.forEach(v => v.remove())
  })
})

module.exports = UserSchema;
