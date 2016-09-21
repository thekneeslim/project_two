var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var flash = require('connect-flash');

router.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

router.get('/home', isLoggedIn, function(req, res) {
  db.country.findAll().then(function(users) {
    res.render('login/home', {allCountries: users})
  });
});

router.post('/home/info', isLoggedIn, function(req, res) {
  console.log(req.body.id);
  db.country.find({
    where: {id: req.body.id}
  }).then(function(country) {
    var coordinatesSelected = {
      latitude : country.latitude,
      longitude : country.longitude
    }

    res.send(coordinatesSelected);
  })
});

router.get('/settings', isLoggedIn, function(req, res) {
  res.render('login/settings')
});

router.post('/settings', isLoggedIn, function(req, res) {
  res.render('login/edit')
});

router.put("/settings/edit/:id", function(req, res) {
  if(req.body.firstName) {
    db.user.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      age: req.body.age,
      country: req.body.country
      }, {
      where: {
        id: req.params.id
      }
    }).then(function(){
      res.redirect("../")
    });
  } else {
    console.log("changing password")
    var oldHash = bcrypt.hashSync(req.body.oldPassword, 10);
    var newHash = bcrypt.hashSync(req.body.newPassword, 10);

    if (req.body.newPassword !== req.body.confirmNewPassword) {
      req.flash('error', 'New Password does not match!');
      res.redirect('../');
    } else if (newHash !== currentUser.password) {
      req.flash('error', 'Old Password does not match!');
      res.redirect('../');
    } else {
      db.user.update({
        password: newHash,
        }, {
        where: {
          id: req.params.id
        }
      }).then(function(){
        res.redirect("../")
      });
    }
  }
});

module.exports = router;
