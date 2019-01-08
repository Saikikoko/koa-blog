const {db} = require('../Schema/config');

const UserSchema = require('../Schema/user');
//引入加密模块
const encrypt = require('../until/encrypt');
//创建User model操作数据库
const User = db.model('users',UserSchema);

//用户注册
exports.reg = async (ctx)=>{
    //注册时post发送过来的数据
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    
    await new Promise((res,rej)=>{
        User.find({username},(err,data)=>{
            if(err)return rej(err);
            if(data.length !==0){
                //有数据，返回空字符串
                return res("");
            }
            //用户名不存在，需要保存到数据库
            const _user = new User({
                username,
                password:encrypt(password),
                commentNum: 0,
                articleNum: 0
            })

            _user.save((err,data)=>{
                if(err){
                    rej(err)
                }else{
                    res(data)
                }
            })
        })
    })
    .then(async data=>{
        if(data){
            await ctx.render("isOK",{
                status:"注册成功"
            })
        }else{
            await ctx.render("isOK",{
                status:"用户名已存在"
            })
        }
    })
    .catch(async err=>{
        await ctx.render("isOK",{
            status:"注册失败，请重试"
        })
    })
}

//用户登录
exports.login = async ctx=>{
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    await new Promise ((res,rej)=>{
        User.find({username},(err,data)=>{
            if(err) return rej(err);
            if(data.length===0) return rej("");
            if(data[0].password===encrypt(password)){
                return res(data);
            }
            return res("");
        });
    })
    .then(async data=>{
        if(!data){
            return ctx.render('isOK',{
                status: "密码输入错误"
            })
        }

        //设置cookie
        ctx.cookies.set("username",username,{
            domain: "localhost",
            path: "/",
            maxAge: 36e5,
            httpOnly: true, //true 不让客户端访问这个cookie
            overwrite: false
        })
        //cookie存储用户ID
        console.log(data);
        ctx.cookies.set("uid",data[0]._id,{
            domain: "localhost",
            path: "/",
            maxAge: 36e5,
            httpOnly: true, //true 不让客户端访问这个cookie
            overwrite: false
        })

        ctx.session = {
            username,
            uid: data[0]._id,
            avatar: data[0].avatar,
            role: data[0].role
        }
        
        await ctx.render('isOk',{
            status: "用户登录成功"
        })
       
    })
    .catch(async err=>{
        if(!err){
            return ctx.render('isOk',{
                status: "用户名不存在"
            })
        }
        await ctx.render('isOk',{
            status: "登录失败"
        })
    })
}

//保持用户的状态
exports.keepLog = async (ctx,next)=>{
    // ctx.session = null;
    if(ctx.session.isNew){//session没值
        if(ctx.cookies.get("uid")){
            ctx.session = {
                username: ctx.cookies.get("username"),
                uid: ctx.cookies.get("uid")
            }
        }
    }
    await next();
}

//用户退出中间件
exports.logout = async ctx => {
    ctx.session = null;
    ctx.cookies.set("usename",null,{
        maxAge: 0
    })

    ctx.cookies.set("uid",null,{
        maxAge: 0
    })

    //在后台重定向
    ctx.redirect("/");
}