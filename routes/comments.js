const express = require('express'),
	router = express.Router(),
	Image = require('../models/image'),
	Comment = require('../models/comment');

const middleware = require('../middleware');

//===============
//COMMENTS ROUTES, nested routes
//===============
// NEW - show form to create new comments
router.get('/images/:id/comments/new', middleware.isLoggedIn, function(req, res) {
	//find image by id
	Image.findById(req.params.id, function(err, image) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { image: image });
		}
	});
});

//CREATE - add new comment
router.post('/images/:id/comments', middleware.isLoggedIn, function(req, res) {
	//lookup image using ID
	Image.findById(req.params.id, function(err, image) {
		if (err) {
			console.log(err);
			res.redirect('/images');
		} else {
			// console.log(req.body.comment);
			//create new comment
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', 'Internal error');
					console.log(err);
				} else {
					// console.log(req.user.username);
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect new comment to image
					image.comments.push(comment);
					image.save();
					// console.log(comment);
					//redirect image to show page
					req.flash('success', 'Succesffuly added comment');
					res.redirect('/images/' + image._id);
				}
			});
		}
	});
});

//COMMENT EDIT ROUTE
router.get('/images/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Image.findById(req.params.id, function(err, foundImage) {
		if (err || !foundImage) {
			req.flash('error', 'No image found');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				res.render('comments/edit', { image_id: req.params.id, comment: foundComment });
			}
		});
	});
});

//COMMENT UPDATE ROUTE
router.put('/images/:id/comments/:comment_id/', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/images/' + req.params.id);
		}
	});
});

//COMMENT DESTROY ROUTE
router.delete('/images/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted');
			res.redirect('/images/' + req.params.id);
		}
	});
});

module.exports = router;
