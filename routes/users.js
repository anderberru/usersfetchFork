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
  let user = {
    id: req.body.id,
    izena: req.body.izena,
    abizena: req.body.abizena,
    email: req.body.email
  };

  db.users.insert( user );
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

  db.users.remove({id: parseInt(req.params.id)});
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
  let user = users.find(user => user.id == req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;
  res.json(users);
})

module.exports = router;
