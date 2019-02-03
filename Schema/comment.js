const { Schema } = require('./config');
const ObjectId = Schema.Types.ObjectId;
//设置Schema
const CommentSchema = new Schema({
    content: String,
    //关联用户表
    from: {
        type: ObjectId,
        ref: "users"
    },
    //关联文章
    article: {
        type: ObjectId,
        ref: "articles"
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
})

CommentSchema.post("remove", (doc) => {
  // 当前这个回调函数  一定会在 remove 事件执行触发
  const Article = require('../Models/article')
  const User = require('../Models/user')
  
  const { from, article } = doc

  // 对应文章的评论数 -1 
  Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec()
  // 当前被删除评论的作者的 commentNum -1
  User.updateOne({_id: from}, {$inc: {commentNum: -1}}).exec()
})

module.exports = CommentSchema;