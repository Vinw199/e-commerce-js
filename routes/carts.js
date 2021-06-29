//Route handlers associated with the shopping cart.
const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();


//Post request to add a item to a cart
router.post('/cart/products', async (req, res)=>{
	//If the cart doesnt exist for a user, create a cart.
	let cart;
	if(!req.session.cartId){
		cart = await cartsRepo.create({ items : [] });
		req.session.cartId = cart.id;
	} 
	
	//If the cart exists, get the cart.
	else {
		cart = await cartsRepo.getOne(req.session.cartId);
	}
	
	//Update the cart.
	const existingItem = cart.items.find( item => item.id===req.body.productId );
	//If the item exixts in the items array.
	if(existingItem){
		existingItem.quantity++;
	} 
	//If the item does not exist in the items array, add new item.
	else {
		cart.items.push({ id: req.body.productId, quantity: 1 });
	}
	
	await cartsRepo.update( cart.id, { items : cart.items });
	res.redirect('/cart');
});


//Route handller to show the cart.
router.get('/cart', async (req,res)=>{
	if(!req.session.cartId){
		return res.redirect('/');
	}
	const cart = await cartsRepo.getOne(req.session.cartId);
	for(let item of cart.items){
		const product = await productsRepo.getOne(item.id);
		item.product = product;
	}
	res.send(cartShowTemplate({ items: cart.items }));
});

//Route handler to delete items in the cart.
router.post('/cart/products/delete', async (req, res) => {
	const { itemId } = req.body;
	const cart = await cartsRepo.getOne(req.session.cartId);
	const items = cart.items.filter(item=> item.id!==itemId);
	await cartsRepo.update(req.session.cartId, { items });
	res.redirect('/cart');
});

module.exports = router;