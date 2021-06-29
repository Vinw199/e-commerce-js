const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { validateEmail, validatePassword, validatePasswordConfirmation, validateEmailSignIn, validatePasswordSignIn } = require('./validator');

const router = express.Router();

//app.get('path', callback) - Registering a route(path) with a route handler.
//get means watch for requests having a method of get.
//'/' means watch for requests having path '/'.
//req consists information about the incoming request. res represents the outgoing response back to the browser.
//Info from the user will be in req. To send something back to the user, res is used.

router.get('/signup', (req, res)=>{						
	res.send(signupTemplate({req}));
});

//Route handler for method POST - signup
router.post('/signup', [ validateEmail, validatePassword, validatePasswordConfirmation ], handleErrors(signupTemplate),
	async (req, res)=>{
		const { email, password } = req.body;
		//Create a user in users repo
		const user = await usersRepo.create({email, password});
	
		//Store id of that user inside the users' cookie
		req.session.userId = user.id;
	
		res.redirect('/admin/products');
});

//Route handler for signout page
router.get('/signout', (req, res)=>{
	req.session = null;
	res.send('You are logged out!!');
});

//Route handler for signin page
router.get('/signin', (req, res)=>{
	res.send(signinTemplate( { } ));
});

//Route handler for signin submission
router.post('/signin', [ validateEmailSignIn, validatePasswordSignIn ], handleErrors(signinTemplate),
	async (req, res)=>{
		const { email }= req.body;
		const user = await usersRepo.getOneBy({email});
		
		
		req.session.userId = user.id;
		res.redirect('/admin/products');
	}	
);

module.exports = router;