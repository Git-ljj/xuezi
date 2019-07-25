const express = require('express');

//引入连接池模块,上一级目录下的用 ../，同级目录下的用 ./
var pool = require('../pool.js');

//创建路由器对象
var router = express.Router();

//添加路由
//1.1用户注册
router.post('/reg',function(req,res){
	var obj = req.body;
	console.log(obj);
	//1.2验证数据是否为空
	if( !obj.uname ){
		res.send({code:401,msg:'uname required'});//code状态码，人为规定
		return;
	}else if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}else if(!obj.email){
		res.send({code:403,msg:'email required'});
		return;
	}else if(!obj.phone){
		res.send({code:404,msg:'phone required'});
		return;
	}
	//1.3执行SQL语句
	pool.query('insert into xz_user set ?',[obj],function(err,result){
		if(err) throw err;
		console.log(result);
		//如果注册成功
		//{code:200,msg:'register suc'}
		if(result.affectedRows>0){
			res.send({code:200,msg:'register suc'});
		}	
	});
	//res.send('注册成功');
});

//2.用户登录
router.post( '/login', function(req,res){
	//2.1获取数据
	var obj = req.body;
	//console.log(obj);
	//2.2验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}	
	//2.3执行SQL语句
	//查找用户和密码同时满足的数据
	pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],function(err,result){
		if(err) throw err;
		//console.log(result);
		//判断是否登陆成功
		if(result.length > 0){
			res.send({code:200,msg:'login suc'});
		}else{
			res.send({code:301,msg:'login err'});
		}
	});	
} );

//3.用户检索
router.get('/detail',function(req,res){
	//3.1获取数据
	var obj = req.query;
	//console.log(obj);
	//3.2验证是否为空
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
		return;
	}
	//3.3执行SQL语句
	pool.query('select * from xz_user where uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		//判断是否检索到用户，如果检索到，把该用户的对象响应到浏览器，否则响应检索不到
		if(result.length > 0){
			res.send(result[0]);
		}else{
			res.send({code:301,msg:'can not found'});
		}
	});
});

//4.修改用户
router.get('/update',function(req,res){
	//4.1获取数据
	var  obj = req.query;
	//console.log(obj);
	//4.2验证数据是否为空
	//遍历对象，获取每个属性值
	var i = 400;
	for(var key in obj){
		i ++;
		//console.log(kry,obj[key]);
		//如果属性值为空，则提示属性名是必须的
		if( !obj[key] ){
			res.send({code: i,msg:key+' required'});
			return;
		}
	}
	//4.3执行SQL语句
	pool.query('update xz_user set ?  where uid=?',[obj,obj.uid],function(err,result){
		if(err) throw err;
		//判断是否修改成功
		if(result.affectedRows > 0){
			res.send({code:200,msg:'update suc'});
		}else{
			res.send({code:301,msg:'update err'});
		}
	});
});

//5.删除用户
router.get('/delete',function(req,res){
	//5.1获取数据
	var obj = req.query;
	//console.log(obj);
	//5.2验证数据
	if(!obj.uid){
		res.send({code:401,msg:'uid is null'});
		return;
	} 
	var str = parseInt(obj.uid);
	//console.log(str);
	//res.send('ok');
	//5.3执行SQL语句
	pool.query('delete from xz_user where uid=?',[str],function(err,result){
		if(err) throw err;
		//console.log(result);
		if(result.affectedRows>0){
			res.send({code:200,msg:'delete suc'});
		}else{
			res.send({code:301,msg:'delete err'});
		}
	});
});

//6.用户列表
router.get('/list', function(req,res){
	//5.1获取数据
	var obj = req.query;
	//5.2验证数据是否为空
	var pno = obj.pno;
	var size = obj.size;
	//如果页码为空，默认值为1
	if(!pno)  pno = 1;
	//如果大小为空，默认值为3
	if(!size)  size = 3;
	//5.3转整形
	pno = parseInt(pno);
	size = parseInt(size);
	//5.4计算开始查询的值
	var start = (pno-1)*size;
	//5.5执行SQL语句
	pool.query('select * from xz_user limit ?,?',[ start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});


//导出路由器对象
module.exports = router;
