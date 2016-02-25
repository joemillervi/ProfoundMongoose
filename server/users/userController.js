var Q = require('q');
var User = require('./userModel');
var bcrypt = require('bcrypt-nodejs')

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  login: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          bcrypt.compare("bacon", hash, function(err, res) {
              // res == true ?
              if (res) {
                res.json(user._id);
              } else {
                return next(new Error('No user'));
              }
          });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  signup: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;

    findUser({ username: username })
      .then(function(user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          bcrypt.hash(password, null, null, function(err, hash) {
            if (err) {
              console.log('hashing error in bcrypt!', err)
            } else {
              return createUser({
                username: username,
                password: hash
              });
            }
          });
        }
      })
      .then(function(user) {
        console.log('new user', user);
        res.json();
      })
      .fail(function(error) {
        next(error);
      });
  }
};
