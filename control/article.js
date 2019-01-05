const {db} = require('../Schema/config');

const ArticleSchema = require('../Schema/article');
//取用户的Schema,为了拿到操作用户集合的对象
const UserSchema = require('../Schema/user');
const User = db.model('users',UserSchema);
//创建Article model操作数据库
const Article = db.model('articles', ArticleSchema);

//返回文章发表页
exports.addPage = async ctx=>{
    await ctx.render('add-article',{
        title: "文章发表页",
        session: ctx.session
    })
}

//文章的发表保存到数据库
exports.add = async ctx =>{
    if(ctx.session.isNew){
        //true没登录
        return ctx.body = {
            msg: "用户未登录",
            status: 0
        }
    }

    //这是用户在登录情况下，发送过来的数据
    const data = ctx.request.body;
    data.author = ctx.session.uid;

    await new Promise((res,rej)=>{
        new Article(data).save((err,data)=>{
            if(err) rej(err);
            res(data);
        })
    })
    .then(data=>{
        ctx.body = {
            msg: "发表成功",
            status: 1
        }
    })
    .catch(err=>{
        ctx.body = {
            msg: "发表失败",
            status: 0
        }
    })

}

//获取文章文章列表
exports.getList = async ctx => {
    //查找每篇文章的头像信息
    let page = ctx.params.id || 1;
    page--;

    const maxNum = await Article.estimatedDocumentCount((err,num) => err ? console.log(err) : num);
    //分页
    const artList = await Article
        .find()
        .sort('-created')
        .skip(5 * page)
        .limit(5)
        .populate({
            path: "author",
            select: "username _id avatar"
        }) //mongoose用于连表查询 
        .then(data=>data)
        .catch(err => console.log(err)); 
    //渲染首页
    await ctx.render("index",{
        session: ctx.session,
        title: "博客首页",
        artList,
        maxNum
    })
}