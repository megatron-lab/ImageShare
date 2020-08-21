require('dotenv').config();

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	passportLocalMongoose = require('passport-local-mongoose'),
	mongoose = require('mongoose'),
	Image = require('./models/image'),
	Comment = require('./models/comment'),
	User = require('./models/user');
// seedDB = require('./seeds'),
// removeExistingDataFromDB = require('./removeExistingData');

//requiring routes
const indexRoutes = require('./routes/index'),
	imageRoutes = require('./routes/images'),
	commentRoutes = require('./routes/comments');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost/imageshare', { useNewUrlParser: true, useUnifiedTopology: true });
// seedDB();
// removeExistingDataFromDB();

app.use(flash());
// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'test123',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use(imageRoutes);
app.use(commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Our app is running on port ${PORT}`);
});
