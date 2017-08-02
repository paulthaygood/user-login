const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressVaidator = require('express-validator');

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');
app.use(bodyParser.urlencoded());
app.use(expressVaidator());

//define users
var users = [];
users.push({'id': 0, 'username': 'user', 'password':'user'});

//set secret for session cookie
app.use(session({
  secret: '7h31r0ny4rd',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('views'));

// authentication middleware
app.use(function(req, res, next) {
    if (req.session.isAuthenticated === undefined) {
        req.session.isAuthenticated = false;
    }
    next();
});


var auth = function(req, res, next) {
  if (req.session && req.session.user === user && req.session.admin)
    return next();
  else
    return res.sendStatus(501);
};


//set default static server path
app.use(express.static('views'));

//check for authentication on success
app.get('/success', (req, res) => {
  if (req.session.isAuthenticated === false) {
    res.redirect('login');
  } else {
    var model = {
      name: req.session.name,
      views: req.session.views++
    }
    res.render('success', model);
  }
});

//check for authentication to protected content
app.get('/success', (req, res) => {
  if (req.session.isAuthenticated === false) {
    res.redirect('login');
  } else {
    var model = {
      username: req.session.username,
    }
    res.render('./success', model);
  }
});

//routes
app.get('/', (req, res) => {
    if(req.session.isAuthenticated === false) {
        res.redirect('login');
    }
    else {
        res.render('success');
    }
});

app.get("/signup", (req, res) => {
  res.render('signup');
})

app.get("/login", (req, res) => {
  res.render('login');
})

//signup-action
app.post('/signup', (req, res) => {
    var user = {
        id: (users.length),
        username: req.body.username,
        password: req.body.password,
    }
    console.log(user);
    users.push(user);
    res.render('success');
}); 

// login action
app.post('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var authenticateUser = users.find(function(q) {
        return q.username === username && q.password === password;
    });
    if(authenticateUser) {
        req.session.isAuthenticated = true;
        req.session.username = authenticateUser.username;
        res.redirect('/success');
    }
    else {
        res.render('login');
    }
});

// logout
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.send("You have logged out.");
});

// logged in page
app.get('success', (req, res) => {

    if (req.session.isAuthenticated === false) {
        res.redirect('login');
    }
    else {
        var model = {
            name: req.session.name,
        }
        res.render('success', model);
    }
});

app.listen('3000');