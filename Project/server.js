var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var db = mongojs('user1:user1@ds129281.mlab.com:29281/cmpe281', ['userlist']);
var session = require('express-session');
var ObjectID = require("mongodb").ObjectID;

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
    res.send({"username":sess.username, "role":sess.role});
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

//check valid username and password
app.post('/authuser', function (req, res) {

  console.log('I received a GET request');
  console.log(req.body.password);

  db.userlist.findOne({
    "username": req.body.username
  }, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result != null && result.password == req.body.password) {
      sess = req.session;
      sess.username = req.body.username;
      sess.user_id = result._id;
      sess.role = result.role;
      console.log("successful");
      res.send({success:"successful","role":sess.role});

    } else {
      console.log("unsuccessful");
      res.send({success:"unsuccessful"});
    }
  });
});

//add project
app.post('/addproject', function (req, res) {
  var projectListCollection = db.collection('projectlist');
  console.log(req.body);
  projectListCollection.insert(req.body, function (err, doc) {
    res.json(doc);
  });
});

//get all project from projectlist
app.get('/viewprojectlist', function (req, res) {
  var projectListCollection = db.collection('projectlist');
  projectListCollection.find({}, (function (err, docs) {
    console.log(docs);
    res.send({"docs":docs,role:sess.role});
  }));
});

app.post('/deleteproject', function (req, res) {
  var projectListCollection = db.collection('projectlist');
  console.log(req.body);
  var id = req.param("id");
  var objId = new ObjectID(id);
  projectListCollection.remove({"_id":objId}, function (err, doc) {
    res.json(doc);
  });
});

//view single project
app.get('/viewproject', function (req, res) {
  var projectListCollection = db.collection('projectlist');
  var id = req.param("id");
  var objId = new ObjectID(id);
  projectListCollection.find({"_id":objId}, (function (err, docs) {
    console.log(docs);
    res.send(docs);
  }));
});

app.post('/updateproject', function (req, res) {
  var projectListCollection = db.collection('projectlist');
  console.log(req.body);
  var id = req.param("id");
  var objId = new ObjectID(id);

  projectListCollection.update({"_id":objId},{$set:{
    "name": req.param("name"),
    "startdate": req.param("startdate"),
    "enddate": req.param("enddate"),
    "description": req.param("description")}}, function (err, doc) {
    res.json(doc);
  });
});

app.post('/updateprofile', function (req, res) {
  var userlist = db.collection('userlist');
  var id = sess.user_id;
  var objId = new ObjectID(id);

  userlist.update({"_id":objId},{$set:{
    "name":req.param("name"),"role":req.param("role"),"last_name":req.param("last_name"),"skills":req.param("skills"),"organization":req.param("organization"),"projects":req.param("projects"),
    "exp":req.param("exp"),"sex":req.param("sex"),"linkedin":req.param("linkedin"),"portfolio":req.param("portfolio"),"country":req.param("country"),"hours":req.param("hours"),"available":req.param("available")
    }}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/getProfile', function (req, res) {
  var userlist = db.collection('userlist');
  var id = sess.user_id;
  var objId = new ObjectID(id);
  userlist.find({"_id":objId}, (function (err, docs) {
    console.log(docs);
    res.send(docs);
  }));
});

app.get('/viewusers', function (req, res) {
  var projectListCollection = db.collection('userlist');
  var role = req.param("role");
  projectListCollection.find({"role": role}, (function (err, docs) {
    console.log(docs);
    res.send({"docs":docs, role:sess.role});
  }));
});

app.get('/viewprofile', function (req, res) {
  var projectListCollection = db.collection('userlist');
  var id = req.param("id");
  var objId = new ObjectID(id);
  projectListCollection.find({"_id":objId}, (function (err, docs) {
    console.log(docs);
    res.send(docs);
  }));
});

app.post('/assignProject', function (req,res) {
    console.log("Assign Project:::")
    var userList = db.collection('userlist');
    var projectListCollection = db.collection('projectlist');


    var project = req.body.project
    var user =  req.body.profileData

    console.log(project)
    console.log(user)

   projectListCollection.update({"_id":  new ObjectID(project._id)},{$push: {assignedUserList: user }}), function (err, results) {
       if(err){
         console.log("Error: "+err)
       }
        if (results) {
            console.log("Successfully added user to the project.");
            json_responses = {"statusCode": 200};


        }
        else {
            json_responses = {"statusCode": 401};
            //res.send(json_responses);
        }

    }

    userList.update({"_id": new ObjectID(user._id)},{$push: {assignedProjectList: project }}), function (err, results) {
        if (results) {
            console.log("Successfully added project to the user.");
            json_responses = {"statusCode": 200};
            //res.send(json_responses);
        }
        else {
            json_responses = {"statusCode": 401};
            //res.send(json_responses);
        }
    }

    res.send({"statusCode": 200});

});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});