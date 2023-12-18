var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var db = mongojs('usersdb', ['users'])
const multer  = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

function fileFilter (req, file, cb) {

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  console.log(file)
  if (file.originalname.split('.')[1] === "png" || file.originalname.split('.')[1] === "jpg" || file.originalname.split('.')[1] === "jpeg"){
      // To reject this file pass `false`, like so:
      cb(null, true)
  } else {
      // To accept the file pass `true`, like so:
      cb(new Error('Error: File must be a png or jpg'), false)
  }

  // You can always pass an error if something goes wrong:
  //cb(new Error('I don\'t have a clue!'))

}

const upload = multer({ dest: 'uploads/', storage: storage, fileFilter: fileFilter })

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


router.post("/new", upload.single('avatar'), (req, res) => {

  var nofoto = req.protocol + '://' + req.get('host') + "/uploads/nofoto.png"

  let response = {
    izena: req.body.izena,
    abizena: req.body.abizena,
    email: req.body.email,
    avatar: req.file ? getURL(req, req.file) : nofoto
  }

  db.users.insert( response, function(err, user) {
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

router.put("/update/:id", upload.single('avatar'), (req, res) => {

  var nofoto = req.protocol + '://' + req.get('host') + "/uploads/nofoto.png"

  
  db.users.update({"_id":  mongojs.ObjectID(req.params.id)}, {
    $set: {izena: req.body.izena, abizena: req.body.abizena, email: req.body.email, avatar: req.file ? getURL(req, req.file) : nofoto}
  }, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.json(user)
    }
  });
  
})

function getURL(req, file){
  return req.protocol + '://' + req.get('host') + "/" + file.destination + file.filename
}

module.exports = router;
