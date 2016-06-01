'use strict';

var path = process.cwd();
var ApiHandler = require(path + '/app/controllers/apiHandler.server.js');

module.exports = function(app, passport) {

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  var apiHandler = new ApiHandler();

  app.route('/')
    .get(isLoggedIn, function(req, res) {
      res.sendFile(path + '/public/index.html');
    });

  app.route('/login')
    .get(function(req, res) {
      res.sendFile(path + '/public/login.html');
    });

  app.route('/logout')
    .get(function(req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/profile')
    .get(isLoggedIn, function(req, res) {
      res.sendFile(path + '/public/profile.html');
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/my-api')
    .get(isLoggedIn, apiHandler.getApis)
    .post(isLoggedIn, apiHandler.addApi)

  app.route('/my-api/:apiid')
    .put(isLoggedIn, apiHandler.updateApi)
    .delete(isLoggedIn, apiHandler.deleteApi);

  app.route('/custom-api/:userName/:apiName/all')
    .get(apiHandler.getQuotes)

  app.route('/custom-api/:userName/:apiName/random')
    .get(apiHandler.getRandomQuote)

  app.route('/api/:id')
    .get(isLoggedIn, function(req, res) {
      res.json(req.user.github);
    });
};
