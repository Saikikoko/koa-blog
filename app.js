const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const Router = require('./routers/router');
const logger = require('koa-logger');
const body = require('koa-body');
const session = require('koa-session');
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

app.listen(3000);