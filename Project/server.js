var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var db = mongojs('user1:user1@ds129281.mlab.com:29281/cmpe281', ['userlist']);
var session = require('express-session');

var sess;
var sess_p;

app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  HttpOnly: false,
  maxAge: 10000
}));

app.use(express.static(__dirname + '/public/production'));
app.use(bodyParser.json());


//session check
app.get('/sessioncheck', function (req, res) {

  console.log('I received a session check request');
  sess = req.session;

  if (sess.username) {
    res.send(sess.username);
  } else {
    res.send("not exist");
  }

});

//session destroy
app.get('/sessiondestroy', function (req, res) {

  console.log('I received a session destroy request');
  sess = req.session;
  sess.destroy(function (err) {
    if (err) {
      console.log('Error destroying session');
      res.send("not done");
    } else {
      console.log('Session destroyed successfully');
      res.send("done");
    }
  });
});

//people signup
app.post('/usersignup', function (req, res) {
  console.log(req.body);
  db.userlist.insert(req.body, function (err, doc) {
    res.json(doc);
  });
});


app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});