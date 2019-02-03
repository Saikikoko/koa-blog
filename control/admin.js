const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')

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
            role: ctx.session.role,
            avatar: ctx.session.avatar,
            username: ctx.session.username
        })
    }else{

        ctx.status = 404;
        await ctx.render("404",{title: "404"})
    }
}

exports.upload = async ctx => {
    const id = ctx.session.uid
    const filename = ctx.req.file.filename
    let data = {}
    await User.updateOne({_id:id},{$set:{avatar:'/avatar/'+filename}},(err,res)=>{
        if(err){
            data = {
                status: 0,
                message: "上传失败"
            }
        }else{
            ctx.session.avatar = '/avatar/' + filename
            data = {
                status: 1,
                message: "上传成功"
            }
        }
    })

    ctx.body = data
}