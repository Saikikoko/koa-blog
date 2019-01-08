const {db} = require('../Schema/config');

//取用户的Schema,为了拿到操作用户集合的对象
const UserSchema = require('../Schema/user');
const User = db.model('users',UserSchema);

//创建Article model操作数据库
const ArticleSchema = require('../Schema/article');
const Article = db.model('articles', ArticleSchema);

//创建Comment model操作数据库
const CommentSchema = require('../Schema/comment');
const Comment = db.model('comments', CommentSchema);


//保存评论
exports.save = async ctx => {
    let message = {
        status: 0,
        msg: "登录才能发表"
    }
    //验证用户登录
    if(ctx.session.isNew)return ctx.body = message;

    //用户已登录
    const data = ctx.request.body;

    data.from = ctx.session.uid

    const _comment = new Comment(data);

    await _comment
    .save()
    .then(data=>{
        message = {
            status: 1,
            msg: "评论成功"
        }

        //更新当前文章的评论数

        Article
        .update({_id: data.article},{$inc:{
            commentNum: 1
        }},err=>{
            if(err)return console.log(err);
            console.log("评论计数更新成功");
        })
        
        //更新用户的评论计数器
        User
        .update({_id: data.from},{$inc:{
            commentNum: 1
        }},err=>{
            if(err)return console.log(err);
            console.log("评论计数更新成功");
        })
    })
    .catch(err=>{
        message = {
            status: 0,
            msg: err
        }
    })

    ctx.body = message;
}