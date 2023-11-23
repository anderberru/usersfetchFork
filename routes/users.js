var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var db = mongojs('usersdb', ['users'])
/*
let users = [
  {id: Date.now(), izena: "John", abizena: "Doe", email: "john@doe.com"},
];
*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.users.find(function(err, users) {
    if (err) {
      console.log(err)
  } else {
    res.render("users", {
      title: "Users", 
      users: users
    });
  }
  });
  
});

router.get('/list', function(req, res, next) {
  db.users.find(function(err, users) {
    if (err) {
      console.log(err)
  } else {
    res.json(users)
  }
  });
  });


router.post("/new", (req, res) => {

  
  db.users.insert( req.body, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.json(user)
    }
    }
   );
  /*
  db.users.find(function(err, users) {
    if (err) {
      console.log(err)
  } else {
    res.json(users)
  }
  });
  */
});

router.delete("/delete/:id", (req, res) => {

  db.users.remove({"_id":  mongojs.ObjectID(req.params.id)});
  /*
  db.users.find(function(err, users) {
    if (err) {
      console.log(err)
    } else {
      res.json(users)
    }
    });
    */
});

router.put("/update/:id", (req, res) => {
  
  db.users.update({"_id":  mongojs.ObjectID(req.params.id)}, {
    $set: {izena: req.body.izena, abizena: req.body.abizena, email: req.body.email}
  }, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.json(user)
    }
  });
  
})

module.exports = router;
