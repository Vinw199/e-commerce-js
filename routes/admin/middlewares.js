const { validationResult } = require('express-validator');

module.exports = {
	
	handleErrors(templateFunc, dataCb) {
		return async (req, res, next) =>{
			const errors = validationResult( req );
			if(!errors.isEmpty()){
				let data = {};
				if(dataCb){
					data = await dataCb(req);
				}
				return res.send(templateFunc({ errors,...data }));
			}
			next();
		}
	},
	
	//to check if a user is signed in
	requireAuth(req,res,next){
		if(!req.session.userId){
			return res.redirect('/signin');
		};
		next();
	}
	
}