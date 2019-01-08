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

module.exports = CommentSchema;