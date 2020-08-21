const mongoose = require('mongoose');

//Schema Setup
const imageSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	location: String,
	coordinates: Array,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

// const Image = mongoose.model('Image', imageSchema);
module.exports = mongoose.model('Image', imageSchema);
