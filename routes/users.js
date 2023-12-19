var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var db = mongojs('usersdb', ['usersMulter'])
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
  db.usersMulter.find(function(err, users) {
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
  db.usersMulter.find(function(err, users) {
    if (err) {
      console.log(err)
  } else {
    res.json(users)
  }
  });
  });


router.post("/new", upload.single('avatar'), (req, res) => {

  var nofoto = req.protocol + '://' + req.get('host') + "/nofoto/nofoto.png"

  let response = {
    izena: req.body.izena,
    abizena: req.body.abizena,
    email: req.body.email,
    avatar: req.file ? getURL(req, req.file) : nofoto
  }

  db.usersMulter.insert( response, function(err, user) {
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

  db.usersMulter.remove({"_id":  mongojs.ObjectID(req.params.id)});
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

  var nofoto = req.protocol + '://' + req.get('host') + "/nofoto/nofoto.png"

  db.usersMulter.findAndModify({
    query: { _id: mongojs.ObjectId(req.params.id) },
    update: {
      $set: {
        izena: req.body.izena, abizena: req.body.abizena, email: req.body.email, avatar: req.file ? getURL(req, req.file) : nofoto
      },
    },
    new: true  
  }, function(err, user, lastErrorObject) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      res.json(user);
    }
  });
  
})


/*
router.put('/update/:id', upload.single('avatar'), (req, res) => {
  let user = users.find((user) => user._id == req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;
  user.avatar = req.file ? getURL(req, req.file) : user.avatar;

  db.users.findAndModify({
    query: { _id: mongoJs.ObjectId(req.params.id) },
    update: {
      $set: {
        izena: req.body.izena,
        abizena: req.body.abizena,
        email: req.body.email,
        avatar: user.avatar,
      },
    },
    new: true
  }, function(err, user, lastErrorObject) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      res.json(user);
    }
  });
});
*/

function getURL(req, file){
  return "https://ariketa4.anderberru.eus"+ "/" + file.destination + file.filename
}
// req.protocol + '://' + req.get('host')
module.exports = router;
