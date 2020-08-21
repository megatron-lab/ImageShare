const mongoose = require('mongoose'),
	Image = require('./models/image'),
	Comment = require('./models/comment');

const data = [
	{
		name: 'SSS',
		image: 'https://a.espncdn.com/photo/2020/0603/nba_mega-bubble-preview1_16x9.jpg',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	},
	{
		name: 'NBA',
		image: 'https://cdn.cnn.com/cnnnext/dam/assets/200729131301-nba-bubble-0722-orlando-restricted-large-169.jpg',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	},
	{
		name: 'AAA',
		image: 'https://clutchpoints.com/wp-content/uploads/2019/08/THUMBNAIL_077-3.jpg',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	}
];
function seedDB() {
	//Remove all images
	Image.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log('removed images!');
		Comment.remove({}, function(err) {
			if (err) {
				console.log(err);
			}
			console.log('removed comments!');
			//add a few images
			data.forEach(function(seed) {
				Image.create(seed, function(err, image) {
					if (err) {
						console.log(err);
					} else {
						console.log('added a image');
						//create a comment
						Comment.create(
							{
								text: 'This place is great, but I wish there was internet',
								author: 'Homer'
							},
							function(err, comment) {
								if (err) {
									console.log(err);
								} else {
									image.comments.push(comment);
									image.save();
									console.log('Created new comment');
								}
							}
						);
					}
				});
			});
		});
	});
	//add a few comments
}

module.exports = seedDB;
