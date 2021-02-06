require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const app = express();
const saltRounds = 10;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true ,useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

/// Database encryption (Level2)

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});


///register user with username and password (LEVEL 1)
app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User ({
            email : req.body.username,
            password: hash  ///Hashing level 3
        });
    
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function(req, res){

    const username = req.body.username;
    const password = req.body.password;  ///Hashing level 3
    
    User.findOne({email :username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    }
                });
            }
        }
    });
});
app.listen(3000, function() {
    console.log("Server started on port 3000");
});


// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"

// "C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe"