const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')


//保存评论
exports.save = async ctx => {
    let message = {
        status: 0,
        msg: "登录才能发表"
    }
    //验证用户登录
    if(ctx.session.isNew)return ctx.body = message;

    //用户已登录
    const data = ctx.request.body;

    data.from = ctx.session.uid

    const _comment = new Comment(data);

    await _comment
    .save()
    .then(data=>{
        message = {
            status: 1,
            msg: "评论成功"
        }

        //更新当前文章的评论数

        Article
        .update({_id: data.article},{$inc:{
            commentNum: 1
        }},err=>{
            if(err)return console.log(err);
            console.log("评论计数更新成功");
        })
        
        //更新用户的评论计数器
        User
        .update({_id: data.from},{$inc:{
            commentNum: 1
        }},err=>{
            if(err)return console.log(err);
            console.log("评论计数更新成功");
        })
    })
    .catch(err=>{
        message = {
            status: 0,
            msg: err
        }
    })

    ctx.body = message;
}

exports.comList = async ctx => {
  const uid = ctx.session.uid

  const data = await Comment.find({from:uid}).populate('article','title')

  ctx.body = {
    code: 0,
    count: data.length,
    data
  }
}

exports.delete = async ctx => {
  const commentId = ctx.params.id
  
  let res = {
    state: 1,
    message: "删除成功"
  }

  //删除评论
  await Comment
  .findById({_id:commentId})
  .then(data => data.remove())
  .catch(err => {
    res = {
      state: 0,
      message: "删除失败"
    }
  })

  ctx.body = res
  // //用户评论计数器更新
  // await User.updateOne({_id:uid},{$inc:{commentNum: -1}})

  // //文章评论计数器更新
  // await Article.updateOne({_id:articleId},{$inc:{commentNum: -1}})

  // // let data = {
  // //   state: 1,
  // //   message: "删除成功"
  // // }

  // //评论更新
  // await Comment.deleteOne({_id:commentId}).then(()=>{  
  //   ctx.body = {
  //     state: 1,
  //     message: "删除成功"
  //   }
  // }).catch(err=>{
  //   ctx.body = {
  //     state: 0,
  //     message: "删除失败"
  //   }
  // })

}