//README: REFER TO THE NOTE BELOW
//NOTE: you can get a free mongodb database using https://mlab.com/, after which follow the instructions there and to create the hosted database
//and paste the connection string below in the place holder const uri = <INSERT-CONNECTION-STRING-HERE>;
//make sure to create a database named "exercise" and 2 collections named "usermapping" and "trackexercise"

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

var mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//start of my codes
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/** this project needs a db !! **/ 
const uri = <INSERT-CONNECTION-STRING-HERE>;
const shortid = require('shortid');

//STATUS: WORKING - USER STORY 1 (creating user)
app.post("/api/exercise/new-user", function (req, res) {
  //Checks if the username specified already exists in the database, if it does return error
  //else allow the creation of the new user
  mongo.connect(uri, function(err, db) {
    var dbo = db.db("exercise");
    
    dbo.collection("usermapping").findOne({username: req.body.username}, function(err, result) {
      if(result == null || result == "") {
        var jsonString = {username: req.body.username, _id: shortid.generate()};
        
        dbo.collection("usermapping").insertOne(jsonString, function(err, res) {
              if (err) throw err;
              db.close();
        });
        
        res.json(jsonString);
      }
      else {
        res.json({userexists: "user already exists in the database"});
        db.close();
      }
  });
  });
});

//STATUS: WORKING - USER STORY 2 (get array of users)
app.get("/api/exercise/users", function (req, res) {
  //add codes to retrieve all users
  mongo.connect(uri, function(err, db) {
    var dbo = db.db("exercise");
    
    dbo.collection("usermapping").find({}).toArray(function(err, result) {
      if(result == null || result == "") {
        res.json({empty: "the database is empty"});
      }
      else {
        res.json(result);
      }
    });
  });
});

//STATUS: WORKING - USER STORY 3 (Adding exercise to database)
app.post("/api/exercise/add", function (req, res) {
  if(req.body.date == null || req.body.date == "") {
    var today = new Date();
    //add codes to check if the uid exists and retrieve the username from the mongodb database (mlab)
    mongo.connect(uri, function(err, db) {
      var dbo = db.db("exercise");
    
      //retrieve the username from the usermapping table, by querying it with the user ID
      dbo.collection("usermapping").findOne({_id: req.body.userId}, function(err, result) {
        if(result == null || result == "") {
          res.json({error: "User does not exist, create a new user first!"});
          db.close();
        }
        else {
          var tobeSaved = {username: result.username, description: req.body.description, duration: req.body.duration, date: today.toDateString()};
          var jsonString = {username: result.username, description: req.body.description, duration: req.body.duration, _id: req.body.userId, date: today.toDateString()};
        
          dbo.collection("trackexercise").insertOne(tobeSaved, function(err, res) {
              if (err) throw err;
              db.close();
          });
      
          res.json(jsonString);
        }
      });
    });
  }
  else {
     var date = new Date(req.body.date);
    //add codes to check if the uid exists and retrieve the username from the mongodb database (mlab)
    mongo.connect(uri, function(err, db) {
      var dbo = db.db("exercise");

      //retrieve the username from the usermapping table, by querying it with the user ID
      dbo.collection("usermapping").findOne({_id: req.body.userId}, function(err, result) {
        if(result == null || result == "") {
          res.json({error: "User does not exist, create a new user first!"});
          db.close();
        }
        else {
          var tobeSaved = {username: result.username, description: req.body.description, duration: req.body.duration, date: date.toDateString()};
          var jsonString = {username: result.username, description: req.body.description, duration: req.body.duration, _id: req.body.userId, date: date.toDateString()};
        
          dbo.collection("trackexercise").insertOne(tobeSaved, function(err, res) {
              if (err) throw err;
              db.close();
          });
      
          res.json(jsonString);
        }
      });
    });
  }
});

//STATUS: WORKING - USER STORY 4 (retriving all of a specific user's exercise minutes and logs)
/*app.get("/api/exercise/log", function (req, res) {
  var userID = req.query.userId;
  mongo.connect(uri, function(err, db) {
      var dbo = db.db("exercise");
      dbo.collection("usermapping").findOne({_id: userID}, function(err, result) {
        if(result == null || result == "") {
          res.json({error: "Invalid User ID"});
          db.close();
        }
        else {
          dbo.collection("trackexercise").find({username: result.username}).project({ _id: 0}).toArray(function(err, r) {
            if(r == null || r == "") {
              res.json({nolog: "this user has no logs yet"});
            }
            else {
              var total = 0;
              for(var i=0; i<r.length; i++) {
                total += parseInt(r[i].duration);
              }
              res.json({totalExerciseMinutes: total, userID: result._id, logs: r});
            }
          });
        }
      });
  });
});*/

//STATUS: WORKING - USER STORY 4 (retriving all of a specific user's exercise minutes and logs)
//STATUS: WORKING - USER STORY 5 (allow optional variables, from, to & limit)
app.get("/api/exercise/log", function (req, res) {
  var userID = req.query.userId;
  var from = req.query.from;
  var to = req.query.to;
  var limit = req.query.limit;
  
  mongo.connect(uri, function(err, db) {
      var dbo = db.db("exercise");
      dbo.collection("usermapping").findOne({_id: userID}, function(err, result) {
        if(result == null || result == "") {
          res.json({error: "Invalid User ID"});
          db.close();
        }
        else {
          if(limit == null || limit == "") {
            dbo.collection("trackexercise").find({username: result.username}).project({ _id: 0}).toArray(function(err, r) {
              if(r == null || r == "") {
                res.json({nolog: "this user has no logs yet"});
              }
              else {
                if((from == null || from == "") && (to == null || to == "")) {
                  var total = 0;
                  for(var i=0; i<r.length; i++) {
                    total += parseInt(r[i].duration);
                  }
                  res.json({totalExerciseMinutes: total, userID: result._id, logs: r});
                }
                else {
                   var remainingArray = {};
                    var total = 0;
                   from = new Date(from);
                    to = new Date(to);
                  
                   for(var j=0; j<r.length; j++) {
                     var d = new Date(r[j].date);
                     if(d > from && d < to) {
                       remainingArray[j] = r[j];
                       total += parseInt(r[j].duration);
                     }
                   }
                  
                  res.json({totalExerciseMinutes: total, userID: result._id, logs: remainingArray});
                }
              }
            });
          }
          else {
            dbo.collection("trackexercise").find({username: result.username}).project({ _id: 0}).limit(parseInt(limit)).toArray(function(err, r) {
              if(r == null || r == "") {
                res.json({nolog: "this user has no logs yet"});
              }
              else {
                if((from == null || from == "") && (to == null || to == "")) {
                  var total = 0;
                  for(var i=0; i<r.length; i++) {
                    total += parseInt(r[i].duration);
                  }
                  res.json({totalExerciseMinutes: total, userID: result._id, logs: r});
                }
                else {
                    var remainingArray = {};
                    var total = 0;
                   from = new Date(from);
                    to = new Date(to);
                  
                   for(var j=0; j<r.length; j++) {
                     var d = new Date(r[j].date);
                     if(d > from && d < to) {
                       remainingArray[j] = r[j];
                       total += parseInt(r[j].duration);
                     }
                   }
                  
                  res.json({totalExerciseMinutes: total, userID: result._id, logs: remainingArray});
                }
              }
            });
          }
        }
      });
  });
    
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(50023, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})