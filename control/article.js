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
    data.commentNum = 0;

    await new Promise((res,rej)=>{
        new Article(data).save((err,data)=>{
            if(err) rej(err);
            //更新用户文章计数
            User.update({_id:data.author},{$inc:{articleNum: 1}},err=>{
                if(err)return console.log(err)
            })
            

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

//文章详情
exports.details = async ctx => {
    //动态获取路由里的id
    const _id = ctx.params.id;

    const article = await Article
    .findById(_id)
    .populate("author","username")
    .then(data=>data)

    //查找当前文章的所有评论
    const comment = await Comment
    .find({article:_id})
    .sort("-created")
    .populate("from","username avatar")
    .then(data=>data)
    .catch(err=>{
        console.log(err)
    });

    await ctx.render("article",{
        title: article.title,
        article,
        comment,
        session: ctx.session 
    })

    
}