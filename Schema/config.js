const mongoose = require('mongoose');

const db = mongoose.createConnection
("mongodb://localhost:27017/blogproject",
{useNewUrlParser: true})

//用原生的ES6 promise 代替mongoose的 promise
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('open',()=>{
    console.log('数据库连接成功');
})


//导出db和Schema
module.exports = {
    db,
    Schema
}