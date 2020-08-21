const Image = require('../models/image'),
	Comment = require('../models/comment');

//all the middleware goes here
const middlewareObj = {};

middlewareObj.checkImageOwnership = function(req, res, next) {
	//is user logged in?
	if (req.isAuthenticated()) {
		Image.findById(req.params.id, function(err, foundImage) {
			if (err || !foundImage) {
				req.flash('error', 'Image not found');
				res.redirect('back');
			} else {
				//does user own the image?
				if (foundImage.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Permission denied');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'Please login first');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	//is user logged in?
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash('error', 'Comment not found');
				res.redirect('back');
			} else {
				//does user own the comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Permission denied');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'Please login first');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Please login first');
	res.redirect('/login');
};

module.exports = middlewareObj;

// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect('/login');
// }

// function checkImageOwnership(req, res, next) {
// 	//is user logged in?
// 	if (req.isAuthenticated()) {
// 		Image.findById(req.params.id, function(err, foundImage) {
// 			if (err) {
// 				res.redirect('back');
// 			} else {
// 				//does user own the image?
// 				if (foundImage.author.id.equals(req.user._id)) {
// 					next();
// 				} else {
// 					res.redirect('back');
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect('back');
// 	}
// }

// function checkCommentOwnership(req, res, next) {
// 	//is user logged in?
// 	if (req.isAuthenticated()) {
// 		Comment.findById(req.params.comment_id, function(err, foundComment) {
// 			if (err) {
// 				res.redirect('back');
// 			} else {
// 				//does user own the image?
// 				if (foundComment.author.id.equals(req.user._id)) {
// 					next();
// 				} else {
// 					res.redirect('back');
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect('back');
// 	}
// }
