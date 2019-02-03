const { Schema } = require('./config');
const ObjectId = Schema.Types.ObjectId;
//设置Schema
const ArticleSchema = new Schema({
    title: String,
    content: String,
    author:{
        type: ObjectId,
        ref: "users"
    },// 关联users的集合
    tips: String,
    commentNum: Number
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
})


ArticleSchema.post("remove", (doc) => {
  // 当前这个回调函数  一定会在 remove 事件执行触发
  const Comment = require('../Models/comment')
  const User = require('../Models/user')
  
  const { _id: articleId, author: authorId } = doc

  // 用户的articleNum -1
  User.updateOne({_id: authorId}, {$inc: {articleNum: -1}}).exec()
  //删除对应的评论
  Comment.find({article:articleId})
  .then(data => {
    data.forEach(v => v.remove())
  })
})

module.exports = ArticleSchema;