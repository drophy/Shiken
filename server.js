'use strict'

const port = 3000;
const passwordHashCount = 7; // arbitrary
const jwtKey = '';
const EXPIRATION_TIME = 60 * 60 * 12; // in seconds, so it's 12 hours right now

/// PACKAGES ///
const authenticate = require('./authenticate.js');

const fs = require('fs');

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // to encrypt passwords
const jwt = require('jsonwebtoken'); // to manage tokens

/// APP CONFIG ///
const app = express();
//app.use(express.static(__dirname));
app.use(express.static("public")); // https://stackoverflow.com/questions/38757235/express-how-to-send-html-together-with-css-using-sendfile

app.use(express.json()); // Carga de forma global el middleware que permite parsear el json

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/// DATABASE ///
mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
   id: Number,
   email: String,
   password: String,
   games: Array
});

const User = mongoose.model("User", userSchema);

/// ROUTES ///
// app.get('/', (req, res) => {
//    res.sendFile(__dirname + "/home.css");
//    //res.write('<h1>Practical 4: Users App</h1>');
//    //res.send();
// });

/// Sign up ///

// Checks if email is unique and, if so, suggests an ID for the new user
app.get('/user/:email', (req, res) =>{
   let found = false;
   let maxID = -1;
  
   User.find((error, data) => {
      if(error)
         console.log(error);
      else {
         for(let i=0; i<data.length; i++){
            let user = data[i];
            if(user.email == req.params.email)
               found = true;
            if(user.id && user.id > maxID)
               maxID = user.id;
         }

         res.status(200).send({EmailExists: found, id:++maxID});
      }
   });
});

// Saves a user to the database
app.post('/users', (req, res) => {
   let body = req.body;
   
   bcrypt.hash(body.password, passwordHashCount, (error, hash) => {
      if(error) {
         res.status(500).send({description:"bcrypt failed to encrypt the password"});
      } else {
         const user = new User({
            id: body.id,
            email: body.email,
            password: hash,
            games: []
         });
         user.save();
      
         let token = jwt.sign(
            {
               id: `${body.id}`,
               email: `${body.email}`
            },
            `${jwtKey}`,
            { expiresIn: EXPIRATION_TIME}
         );

         res.status(200).send({token: token});
      }
   })
});

/// Log in /// 
app.get('/password/:email/:pass', (req, res) =>{
   User.findOne({email:req.params.email}, (error, data) => {
      if(error)
         console.log(error);
      else 
      {
         if(data != null){
            bcrypt.compare(req.params.pass, data.password, (error,result) => {
            if (result) 
            {
               let token = jwt.sign(
                  {
                     id: `${data.id}`,
                     email: `${data.email}`
                  },
                  `${jwtKey}`,
                  { expiresIn: EXPIRATION_TIME}
               );
               res.status(200).send({PasswordCorrect: true, id: `${data.id}`, token: token});
            }
            else
               res.status(200).send({PasswordCorrect: false, id: "-1"});
            });
         } else res.status(404).send({id: "-1"});
      }   
   });
});

/// Get user quizes ///
app.get('/quiz', authenticate, (req, res)=>{
   let arrQuiz = [];
   //Esto usa email cambiar a un token
   User.findOne({email:req.query.email}, (error, data) => {
      if(error){
         console.log(error);
         res.status(404).send({});
      }else{
         arrQuiz = data.games;
         res.status(200).send({games: arrQuiz});
      }
   });
});

app.get('/quiz/:token', (req, res)=>{
   let arrQuiz = [];
   //Esto usa email cambiar a un token
   User.findOne({email:req.params.token}, (error, data) => {
      if(error){
         console.log(error);
         res.status(404).send({});
      }else{
         arrQuiz = data.games;
         res.status(200).send({games: arrQuiz});
      }
   });
});

/// Tests ///
app.get('/tests', (req, res) => {

   // User.findOne({email:'LapineMan@gmail.com'}, (error, data) => {
   //    if(error) console.log(error);
   //    else
   //    {
   //       User.updateOne({email:'billcypher@gmail.com'}, {games:data.games}, (e) => console.log(e));
   //       res.send('Updated!');
   //    }
   // });

   // const complexUser = new User({
   //    email: 'testuser3@gmail.com',
   //    password: 'test',
   //    games: []
   // });

   // User.updateOne({email:'testuser2@gmail.com'}, {games: array}, (error) => {
   //    if(error) console.log(error);
   //    else console.log("updated! (?)");
   // });

   // User.find((error, data) => {
   //    if(error)
   //       console.log(error);
   //    else
   //       data.forEach((user) => console.log(user.email));
   //       //console.log(data);
   // });

   // apple.save();
   // User.insertMany([Ricardo, drophy]);
   
   // res.sendFile(__dirname + "/public/index.html");

   // mongoose.connection.close();
});