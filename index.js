var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');
var passport = require('./config/ppConfig');
var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var methodOverride = require('method-override')
var cors = require('cors');

var publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use(cors());

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(session({
  secret: "secretUser",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use('/auth', require('./controllers/auth'));
app.use('/login', require('./controllers/login'));

app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/login/home')
  } else {
    res.render('index')
  }
});

app.post('/', passport.authenticate('local', {
  successRedirect: '/login/home',
  failureRedirect: '/',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
