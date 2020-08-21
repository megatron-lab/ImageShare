const mongoose = require('mongoose'),
	Image = require('./models/image'),
	Comment = require('./models/comment');

function removeExistingDataFromDB() {
	Image.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
	});
}

module.exports = removeExistingDataFromDB;
