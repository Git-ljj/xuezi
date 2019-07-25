//引入模块
const express = require('express');
const bodyParser = require('body-parser');   //引入body-parser中间件
const mysql = require('mysql');   //引入mysql
//引入用户路由器
const userRouter = require('./routes/user.js');
const productRouter = require('./routes/product.js');
const cartRouter = require('./routes/cart.js');

//创建web服务器
var app = express();
app.listen(8080);

//使用body-parser中间件,将post请求的数据解析为对象
app.use( bodyParser.urlencoded({
	extended:false
}) );

//托管静态资源到public目录下
app.use( express.static('./public') );

//使用路由器，挂载到/user下   -->  /user/reg
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);

