'use strict';

var Users = require('../models/users.js');

function findApiQuotes(username, apiName, callback) {
  Users
    .findOne({ 'username': username })
    .exec(function(err, result) {
      if (err) { throw err; }
			var api = result.apis.filter(function(api) {
				return api.name === apiName
			})
      callback(api[0].quotes);
    })
}

function ApiHandler() {

  this.getApis = function(req, res) {
    Users
      .findOne({ 'github.id': req.user.github.id }, { '_id': false })
      .exec(function(err, result) {
        if (err) {
          throw err; }

        res.json(result.apis);
      });
  };

  this.getQuotes = function(req, res) {
		findApiQuotes(req.params.username, req.params.apiName, function(quotes) {
			res.json(quotes);
		})
  }

	this.getRandomQuote = function(req, res) {
		findApiQuotes(req.params.username, req.params.apiName, function(quotes) {
			var randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
			res.json(randomQuote);
		})
	}

	this.addApi = function(req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { 'apis': req.body } }, { new: true })
			.exec(function(err, result) {
				if (err) {
					throw err; }

				res.json(result);
			});
	};

  this.updateApi = function(req, res) {
    Users
      .findOneAndUpdate({ 'apis._id': req.params.apiid}, { $set: { 'apis.$.name': req.body.name, 'apis.$.quotes': req.body.quotes } }, { new: true })
      .exec(function(err, result) {
        if (err) {
          throw err; }

        res.json(result);
      });
  };

  this.deleteApi = function(req, res) {
    Users
      .findOneAndUpdate({ 'github.id': req.user.github.id }, { $pull: {'apis': { _id: req.params.apiid } } }, { new: true })
      .exec(function(err, result) {
        if (err) {
          throw err; }

        res.json(result);
      });
  };

}

module.exports = ApiHandler;
