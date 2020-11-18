const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User");

router.get('/signup', (req, res) => {
    console.log("this is the route to signup");
    res.render('signup');
  });

router.post('/signup', (req,res,next) => {
console.log('this is signup POST');

const {username, password} = req.body;
//check if pw long enough and user not empty
if (password.length < 8) {
  res.render('signup', {message: 'Your pw must be 8chars minimum'});
}
if (username === '') {
  res.render('signup', {message: 'Your username cant be empty'});
}
//check if username exists already
User.findOne({username: username})
.then (found => {
  if (found != null) {
    res.render('signup', {message: 'This username is already taken, pls choose another one'})
  } else { // FINALLY CREATE NEW USER
    console.log("This would be a new user created")
    const salt = bcrypt.genSaltSync();
    console.log('salt: ', salt);
    // const hash = bycrypt.hashSync(password, salt);
    // User.create({username: username, password: hash})
    // then(dbUser => {
    //   //log in 
    // })
    res.render('/')
  }
})
// res.render('signup')
})

module.exports = router;