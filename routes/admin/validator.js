const usersRepo = require('../../repositories/users');
const { check } = require('express-validator');

module.exports = {
	validateTitle :
			check('title')
			.trim()
			.isLength( { min: 4, max: 30 } )
			.withMessage('Must be between 5 and 40 characters'),
	
	validatePrice :
			check('price')
			.trim()
			.toFloat()
			.isFloat( { min : 1 } )
			.withMessage('Must be a number greater than 1'),
			
	validateEmail : 
			check('email')
			.trim()
			.normalizeEmail()
			.isEmail()
			.withMessage('Must be a valid email')
			.custom( async (email)=>{
				const existingUser= await usersRepo.getOneBy({email});
				if(existingUser){
					throw new Error('Email in use');
				}
			}),
			
	validatePassword: 
			check('password')
			.trim()
			.isLength({min:3, max:20})
			.withMessage('Password must be between 3 and 20 characters'),

	validatePasswordConfirmation: 
			check('passwordConfirmation')
			.trim()
			.custom( (passwordConfirmation, { req }) => {
				if(passwordConfirmation !== req.body.password){
					throw new Error('Passwords must match');
				} else { return true; }
			}),

	validateEmailSignIn:
			check('email')
			.trim()
			.normalizeEmail()
			.isEmail()
			.withMessage('Must provide a valid email')
			.custom( async (email)=>{
				const user = await usersRepo.getOneBy({email});
				//Check if a user with the given email exists.
				if(!user){
					throw new Error('Email not found');
				}
			}),
			
	validatePasswordSignIn:
			check('password')
			.trim()
			.custom( async ( password, { req } ) => {
				const user = await usersRepo.getOneBy( { email: req.body.email } );
				if (!user) {
					throw new Error('Invalid password');
				}
				//Compare passwords.
				const validPassword = await usersRepo.comparePasswords(user.password, password);
				if(!validPassword){
					throw new Error('Invalid password');
				}
			})
};