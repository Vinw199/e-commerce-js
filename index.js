//Main index file.

const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app= express();							//App is an object that represents everything that express can do.

app.use(express.static('public'));				//Make the files inside public directory accessible to the outside world.
//Automatic data parsing, i.e., from buffer form to storing it in object form in req.body. 
app.use(bodyParser.urlencoded({extended:true}));			//Every single route handlers will use bodyParser to parse the incoming data. After writing this line of code, we dont have to worry about parsing any data anymore.
app.use(cookieSession({										
	keys:['ffjdfjdjdjkdkj']									//keys property to encrypt the cookie info.
}));


//Middleware - bodyParser
//	const bodyParser=(req, res, next)=>{
//		if(req.method==='POST'){
//			req.on('data', (data)=>{
//			const parsed = data.toString('utf8').split('&');		//buffer converted to string in utf8 format. query string split at ? and stored in array.
//			const formData={};										//split each item in array in the form 'email=kjdbfksd' in = mark, and store as key and value in the object.
//			for(let pair of parsed){
//				const[key, value]=pair.split('=');
//				formData[key]=value;
//			}
//			req.body=formData;
//			next();
//		});
//		} else{
//			next();
//		}
//	};

//Linking route handlers from auth.js, products.js  to this file.
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

//Listen to port 3000 for network requests.
app.listen(3000, ()=> {
	console.log('LISTENING...');
});

