const Router = require('koa-router');
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment');
const admin = require('../control/admin');
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

//管理页面
router.get("/admin/:id",user.keepLog,admin.index);

//404页面
router.get("*",async ctx => {
    await ctx.render("404",{
        title: "404"
    })
})

module.exports = router;