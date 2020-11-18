require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

//  Jan hat dass in einer hash.js const bcrypt = require('bcrypt');


// // ? Woher hatte Jan dieses Codesnippet, kann mich gar nicht erinnern.
// mongoose
//   .connect('mongodb://localhost/node-basic-auth', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(x => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
//   })
//   .catch(err => {
//     console.error('Error connecting to mongo', err)
//   });


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
// ? Wo kommt das her, brauchen wir das wirklich? War das im Githubstartcode? Bei Jans Beispiel war es nicht
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

// Ob wir diesen Block brauchen? Bei Jans Beispiel war er, aber in unserem startcode nicht
// app.use(require('node-sass-middleware')({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// express-session config
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      // session is uninitialized when it is new but not modified 
      saveUninititalized: false,
      // always resave even if not modified
      resave: true,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        // time to live - if the session cookie has an expiration date this is used - 
        // if not the ttl option is used 
        ttl: 24 * 60 * 60 * 1000
      })
    })
  )
  
  // end of configuration

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth');
app.use('/', auth);

module.exports = app;
