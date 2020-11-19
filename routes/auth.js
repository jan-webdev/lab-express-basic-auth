const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User");

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  // get username and password
  const { username, password } = req.body;
  // check if username is correct -> exists in our database if not render login again
  User.findOne({ username: username })
    .then(found => {
      if (found === null) {
        res.render('login', { message: 'Invalid credentials' })
      }
      // username exists in our database
      // check if the password matches the password for that user in the database
      if (bcrypt.compareSync(password, found.password)) {
        // password and hash match
        // login the user
        req.session.user = found;
        res.redirect('/');
      } else {
        res.render('login', { message: 'Invalid credentials' })
      }
    })
});

// SIGNUP 
router.post('/signup', (req, res, next) => {
      const {
        username,
        password
      } = req.body;
      //check if pw long enough and user not empty
      if (password.length < 8) {
        res.render('signup', {
          message: 'Your pw must be 8chars minimum'
        });
      }
      if (username === '') {
        res.render('signup', {
          message: 'Your username cant be empty'
        });
      }
      //check if username exists already
      User.findOne({
          username: username
        })
        .then(found => {
          if (found !== null) {
            res.render('signup', {
              message: 'This username is already taken, pls choose another one'
            })
          } else { // FINALLY CREATE NEW USER
            const salt = bcrypt.genSaltSync();
            console.log('salt: ', salt);
            const hash = bcrypt.hashSync(password, salt);
            User.create({
                username: username,
                password: hash
              })
              .then(dbUser => {
                console.log('req.session.user BEFORE : ',req.session.user);
                // nun muss dier User:in noch eingeloggt werden
                req.session.user = dbUser; // does this mean that the user is now stored in user and that this info is transported to the next page?
                console.log('req.session.user: ',req.session.user);
                res.redirect('/');
              })
              .catch(err => {
                console.log('error while creating user A :', err);
                next(err);
              });
          }
        })
        .catch(err => {
          console.log('error while creating user B :', err);
          next(err);
        })
      })
// LOGOUT - copypasta from jan

      router.get('/logout', (req, res, next) => {
        console.log('req.session.user BEFORE LOGGING OUT: ',req.session.user);
        req.session.destroy(err => {
          if (err) {
            next(err);
          } else {
          //   console.log('req.session.user AFTER OGGING OUT: ',req.session.user);
            res.redirect('/')
          }
        })
      });

      module.exports = router;