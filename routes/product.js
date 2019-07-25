const express = require('express');

//引入连接池模块
const pool = require('../pool.js');

//创建路由器对象
var router = express.Router();

//添加路由
//1.商品列表
router.get('/list', function(req,res){
	//1.1获取数据
	var obj = req.query;
	//console.log(obj);
	//将数据转为整形
	var pno = parseInt(obj.pno);
	var count = parseInt(obj.count);
	//若数据为空或0时，设置默认值
	if(!pno) pno = 1;
	if(!count) count = 3;
	//计算start的值
	var start = (pno-1)*count;
	//执行SQL语句
	pool.query('select lid,price,title from xz_laptop limit ?,?',[start,count],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});

//2.商品详情
router.get('/detail',function(req,res){
	var obj = req.query;
	//console.log(obj);
	if(!obj.lid){
		res.send({code:401,msg:'lid is null'});
		return;
	}
	//执行SQL语句
	pool.query('select * from xz_laptop where lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send({code:301,msg:'lid required'});
		}		
	});
});

//3.删除商品
router.get('/delete',function(req,res){
	var obj = req.query;
	//console.log(obj);
	if(!obj.lid){
		res.send({code:401,msg:'lid is null'});
		return;
	}
	//执行SQL语句
	pool.query('delete from xz_laptop where lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'delete suc'});
		}else{
			res.send({code:301,msg:'delete err'});
		}
	});
});

//4.商品添加
router.post('/add',function(req,res){
	//4.1获取数据
	var obj = req.body;
	//console.log(obj);
	//4.2验证数据
	var i = 400;
	for(var key in obj){
		i ++;
		if(!obj[key]){
			res.send({code:i,msg:obj[key] + 'required'});
			return;
		}
	}
	//4.3执行SQL语句
	pool.query('insert into xz_laptop set ?',[obj],function(err,result){
		if(err) throw err;
		if(result.affectedRows > 0){
			res.send({code:200,msg:'add suc'});
		}else{
			res.send({code:301,msg:'add err'});
		}
	});
});



//导出路由器
module.exports = router;