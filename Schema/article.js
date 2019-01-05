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
    tips: String
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
})

module.exports = ArticleSchema;