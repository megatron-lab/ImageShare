const express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user');

const middleware = require('../middleware');

//root route
router.get('/', function(req, res) {
	res.render('landing');
});

//=====================
//AUTHENTICATION ROUTES
//=====================
//show register form
router.get('/register', function(req, res) {
	res.render('register');
});

//handle sign up logic
router.post('/register', function(req, res) {
	const newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			// console.log(err);
			return res.render('register', { error: err.message });
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/images');
		});
	});
});

//show login form
router.get('/login', function(req, res) {
	res.render('login');
});

//handling login logic
// app.post("/login", middleware, callback)
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/images',
		failureRedirect: '/login'
	}),
	function(req, res) {}
);

//logout route
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Logged you out');
	res.redirect('/images');
});

module.exports = router;
