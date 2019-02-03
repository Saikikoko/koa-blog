const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const Router = require('./routers/router');
const logger = require('koa-logger');
const body = require('koa-body');
const session = require('koa-session');
const compress = require('koa-compress')
const {join} = require('path');
//生成koa实例
const app = new Koa;

app.keys = ["I LOVE U"];
//session 配置对象
const CONFIG = {
  key: "Sid",
  maxAge: 36e5,
  rolling: true//每操作一次刷新一下过期时间
}
//注册日志模块
app.use(logger());

// 注册资源压缩模块 compress
app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

//配置session
app.use(session(CONFIG,app))
//处理post请求
app.use(body());

//配置静态资源目录
app.use(static(join(__dirname,'public')));

//配置视图模板
app.use(views(join(__dirname,'views'),{
    extension: "pug"
}))

//配置路由模块
app
  .use(Router.routes())
  .use(Router.allowedMethods());

app.listen(4000);

//创建管理员用户，如果管理员用户已存在，则返回
{
    const {db} = require('./Schema/config');
    const UserSchema = require('./Schema/user');
    const encrypt = require('./until/encrypt');
    const User = db.model('users',UserSchema);

    User
    .find({username: "admin"})
    .then(data=>{
        if(data.length === 0){
            //管理员不存在
            new User({
                username: "admin",
                password: encrypt("admin"),
                role: 666,
                articleNum: 0,
                commentNum: 0
            })
            .save()
            .then(data=>{
                console.log("管理员用户名：admin 密码：admin")
            })
            .catch(err=>{
                console.log("管理员创建失败")
            })
        }else{
            //管理员存在
            console.log("管理员用户名：admin 密码：admin")
        }
    })
}