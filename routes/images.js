const image = require('../models/image');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

const express = require('express'),
	router = express.Router(),
	Image = require('../models/image');

const middleware = require('../middleware');
const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');

//===============
//IMAGE ROUTES, nested routes
//===============
//INDEX - show all images
router.get('/images', function(req, res) {
	// console.log(req.user);
	//Get all images from DB
	Image.find({}, function(err, allImagesFromDB) {
		if (err) {
			console.log(err);
		} else {
			res.render('images/index', { images: allImagesFromDB, currentUser: req.user });
		}
	});
	// res.render('images/index');
});

//CREATE - add new image to DB
router.post('/images', middleware.isLoggedIn, function(req, res) {
	//get data from form
	const name = req.body.name,
		image = req.body.image,
		description = req.body.description,
		author = {
			id: req.user._id,
			username: req.user.username
		},
		location = req.body.location;
	const newImage = {
		name: name,
		image: image,
		description: description,
		author: author
	};

	const response = geocodingClient
		.forwardGeocode({
			query: location,
			limit: 1
		})
		.send()
		.then((response) => {
			const match = response.body;
		});
	console.log(response);
	//Create a new image and save to DB
	Image.create(newImage, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//redirect back to images page
			res.redirect('/images');
		}
	});
});

//NEW - show form to create new image
router.get('/images/new', middleware.isLoggedIn, function(req, res) {
	res.render('images/new');
});

//SHOW - shows more info about one image
router.get('/images/:id', function(req, res) {
	//find the image with provided ID
	//FindById(id, callback)
	//finding a Image first which is find by id, populating comments on that image and then with .exec we are executing the query that we made
	//retrieving image with right id, populating the comments array on it, and then send it to template
	Image.findById(req.params.id).populate('comments').exec(function(err, foundImage) {
		if (err || !foundImage) {
			console.log(err);
			req.flash('error', 'Image not found');
			res.redirect('back');
			// console.log(err);
		} else {
			//render show template with that image
			res.render('images/show', { image: foundImage });
		}
	});
});

//EDIT IMAGE ROUTE
router.get('/images/:id/edit', middleware.checkImageOwnership, function(req, res) {
	Image.findById(req.params.id, function(err, foundImage) {
		res.render('images/edit', { image: foundImage });
	});
});

//UPDATE IMAGE ROUTE
router.put('/images/:id', middleware.checkImageOwnership, function(req, res) {
	//find and update the correct image
	Image.findByIdAndUpdate(req.params.id, req.body.image, function(err, updatedImage) {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/images');
		} else {
			//redirect somewhere(show page)
			req.flash('success', 'Successfully Updated!');
			res.redirect('/images/' + req.params.id);
		}
	});
});

//DELETE IMAGE ROUTE
router.delete('/images/:id', middleware.checkImageOwnership, function(req, res) {
	Image.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/images');
		} else {
			res.redirect('/images');
		}
	});
});

module.exports = router;
