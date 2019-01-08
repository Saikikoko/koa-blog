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

const fs = require('fs');
const {join} = require('path');

exports.index = async ctx => {
    if(ctx.session.isNew){
        //没有登录
        ctx.status = 404;
        return await ctx.render("404",{title: "404"});
    }

    const id = ctx.params.id;

    const arr = fs.readdirSync(join(__dirname,"../views/admin"));

    let flag = false;
    arr.forEach(v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g,"");
        if(name === id){
            flag = true;
        }
    })

    if(flag){
        await ctx.render("./admin/admin-" + id,{
            role: ctx.session.role
        })
    }else{

        ctx.status = 404;
        await ctx.render("404",{title: "404"})
    }
}