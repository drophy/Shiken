'use strict'

const port = 3000;

/// PACKAGES ///
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');

/// STUFF ///
const app = express();
//app.use(express.static(__dirname));
app.use(express.static("public")); // https://stackoverflow.com/questions/38757235/express-how-to-send-html-together-with-css-using-sendfile

app.use(express.json()); // Carga de forma global el middleware que permite parsear el json

/// ROUTES ///
// app.get('/', (req, res) => {
//    res.sendFile(__dirname + "/home.css");
//    //res.write('<h1>Practical 4: Users App</h1>');
//    //res.send();
// });

/// DATABASE ///
mongoose.connect('', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
   email: String,
   password: String,
   games: Array
});

const User = mongoose.model("User", userSchema);

// Return the emails of all users as an array
app.get('/users', (req, res) => {
   let arrEmails = [];
   
   User.find((error, data) => {
      if(error)
         console.log(error);
      else {
         data.forEach((user) => arrEmails.push(user.email));
         res.status(200).send(arrEmails);
      }
   });
});

app.post('/users', (req, res) => {
   let body = req.body;
   console.log(body);
});

app.get('/tests', (req, res) => {


   const complexUser = new User({
      email: 'testuser3@gmail.com',
      password: 'test',
      games: []
   });

   User.updateOne({email:'testuser2@gmail.com'}, {games: array}, (error) => {
      if(error) console.log(error);
      else console.log("updated! (?)");
   });

   User.find((error, data) => {
      if(error)
         console.log(error);
      else
         data.forEach((user) => console.log(user.email));
         //console.log(data);
   });

   // apple.save();
   // User.insertMany([Ricardo, drophy]);
   
   res.sendFile(__dirname + "/public/index.html");

   // mongoose.connection.close();
});

/// LISTEN THINGY ///
app.listen(port, () => console.log(`Example app listening on port ${port}!`));