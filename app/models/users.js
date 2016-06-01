'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  github: {
    id: String,
    displayName: String,
    username: String,
    publicRepos: Number
  },
  apis: [{
    name: String,
    quotes: [{
      author: String,
      text: String
    }]
  }]
});

module.exports = mongoose.model('User', User);
