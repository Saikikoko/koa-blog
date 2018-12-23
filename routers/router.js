const Router = require('koa-router');
const user = require('../control/user');
const router = new Router;

//设置主页
router.get("/",user.keepLog,async ctx => {
    await ctx.render("index.pug",{
        // session:{
        //     role:666
        // },
        title:"我的博客",
        session: ctx.session
    })
})

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

module.exports = router;