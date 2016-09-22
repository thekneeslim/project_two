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


// ROUTES RELATED TO HOME
router.get('/home', isLoggedIn, function(req, res) {
  db.country.findAll({
    order: 'name ASC'
  }).then(function(country) {
    db.favourite.findAll({
      where: {
        userId: req.user.dataValues.id
      },
      order: ['countryName']
    }).then(function(favourites) {
      console.log(favourites)
      res.render('login/home', {allCountries: country, favourites: favourites})
    })
  });
});

router.post('/home/idinfo', isLoggedIn, function(req, res) {
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

router.post('/home/countryinfo', isLoggedIn, function(req, res) {
  console.log(req.body);
  db.country.find({
    where: {name: req.body.countryName}
  }).then(function(country) {
    var coordinatesSelected = {
      latitude : country.latitude,
      longitude : country.longitude
    }

    res.send(coordinatesSelected);
  })
});

// ROUTES RELATED TO SETTINGS & PROFILE
router.get('/settings', isLoggedIn, function(req, res) {
  db.country.findAll().then(function(country) {
    res.render('login/settings', {allCountries: country})
  });
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

// ROUTES RELATING MANAGING FAVOURITES
router.get('/favourites', isLoggedIn, function(req, res) {
  db.country.findAll({
    order: 'name ASC'
  }).then(function(country) {
    db.favourite.findAll({
      where: {
        userId: req.user.dataValues.id
      },
      order: ['countryName']
    }).then(function(favourites) {
      console.log(favourites)
      console.log("Routing back to client");
      res.render('login/favourites', {allCountries: country, favourites: favourites})
    })
  });
});

router.post('/favourites', isLoggedIn, function(req, res) {
  console.log("I'm creating")
  console.log(req.body)
  db.favourite.create({
    countryName: req.body.countryAdded,
    userId: req.user.dataValues.id
  }).then(function(favorite) {
    //code here
    console.log("redirecting");
    res.redirect('/login/favourites')
  })
});

router.delete('/favourites/edit/:id', isLoggedIn, function(req, res) {
  console.log("I'm deleting")
  db.favourite.destroy({
    where: {
      id: req.params.id
    }
  }).then(function() {
    res.redirect('/login/favourites')
  });
});

module.exports = router;
