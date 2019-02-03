const Router = require('koa-router');
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment');
const admin = require('../control/admin');
const upload = require('../until/upload')
const router = new Router;

//设置主页
router.get("/",user.keepLog,article.getList)

//设置登录页 和 注册页
router.get(/^\/user\/(?=reg|login)/,async ctx=>{
    const show = /reg$/.test(ctx.path);
    //show 为true则显示注册，false则显示登录
    await ctx.render('register',{show});
})

//处理登录请求
router.post('/user/login',user.login);

//处理注册请求
router.post('/user/reg',user.reg);

//用户退出
router.get('/user/logout',user.logout);

//文章发表页面
router.get('/article',user.keepLog,article.addPage);

//文章添加
router.post('/article',user.keepLog,article.add);

//文章列表分页路由
router.get('/page/:id',article.getList);

//文章详情页
router.get("/article/:id",user.keepLog,article.details);

//发表评论
router.post('/comment',user.keepLog,comment.save);

//管理页面 文章 评论 头像上传页面
router.get("/admin/:id",user.keepLog,admin.index);


//头像上传
router.post('/admin/upload',user.keepLog,upload.single('file'),admin.upload)

//评论管理
router.get('/user/comments',user.keepLog,comment.comList)

//用户管理
router.get('/user/users',user.keepLog,user.usrList)
//文章管理
router.get('/user/articles',user.keepLog,article.artList)

//删除评论
router.delete('/comment/:id',user.keepLog,comment.delete)

//删除文章
router.delete('/article/:id',user.keepLog,article.delete)

//删除用户
router.delete('/user/:id',user.keepLog,user.delete)

//404页面
router.get("*",async ctx => {
    await ctx.render("404",{
        title: "404"
    })
})

module.exports = router;