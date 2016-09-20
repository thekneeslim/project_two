var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  console.log(req.body);
    if (req.body.password !== req.body.confirmPassword) {
      req.flash('error', 'Password does not match!');
      res.redirect('/auth/signup');
    } else {
      db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password
        }
    }).spread(function(user, created) {
      if (created) {
        // FLASH
        console.log("successful creation");
        passport.authenticate('local', {
          successRedirect: '/login/home',
          successFlash: 'Account created and logged in'
        })(req, res);
      } else {
        console.log("failed to create");
        // FLASH
        req.flash('error', 'Email already exists');
        res.redirect('/auth/signup');
      }
    }).catch(function(error) {
      console.log(error.message);
      // FLASH
      req.flash('error', error.message);
      res.redirect('/auth/signup');
    });
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

module.exports = router;
