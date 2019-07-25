const express = require('express');

//引入连接池模块
const pool = require('../pool.js');

//创建路由器
var router = express.Router();

//创建路由
//1.添加购物车
router.get('/add',function(req,res){
	var obj = req.query;
	console.log(obj);
	res.send('ok');
});




//导出路由器
module.exports = router;