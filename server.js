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
const socketIO = require('socket.io');

/// APP CONFIG ///
const app = express();
//app.use(express.static(__dirname));
app.use(express.static("public")); // https://stackoverflow.com/questions/38757235/express-how-to-send-html-together-with-css-using-sendfile

app.use(express.json()); // Carga de forma global el middleware que permite parsear el json

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/// DATABASE ///
mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
   id: Number,
   email: String,
   password: String,
   games: Array
});

const User = mongoose.model("User", userSchema);

/// SOCKETS ///
const io = socketIO(server);

// Connections in general
io.on('connection', function(socket) {
   console.log('someone connected to the socket');
   
   // New user notifications
   socket.on('newUser', function(objData) {
      socket.broadcast.emit('newUser', objData);
   });
});

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
            if(user.id > maxID) {
               maxID = user.id;
            }
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

/// Create new quiz ///
app.post('/games/add', authenticate, (req, res) => {
   let body = req.body;
   let arrGames;

   User.findOne({id:req.query.id}, (error, data) => {
      if(error) {
         console.log(error);
         res.status(500).send({Message: "There was an error while fetching the data from the DB"});
      }
      else {
         arrGames = data.games;
         arrGames.push(body.Game);
         User.updateOne({id:req.query.id}, {games: arrGames}, (error) => {
            if(!error) console.log('Added game succesfully! :D');
         });
         res.status(200).send({Message: "Added new quiz successfully!"});
      }
   });
   
});

/// Modify quiz ///
app.post('/games/update/:i', authenticate, (req, res) => {
   let body = req.body;
   let arrGames;
   let i = req.params.i; 

   User.findOne({id:req.query.id}, (error, data) => {
      if(error) {
         console.log(error);
         res.status(500).send({Message: "There was an error while fetching the data from the DB"});
      }
      else {
         arrGames = data.games;
         body.Game.Description = arrGames[i].Description;
         arrGames[i] = (body.Game);
         User.updateOne({id:req.query.id}, {games: arrGames}, (error) => {
            if(!error) console.log('Added game succesfully! :D');
         });
         res.status(200).send({Message: "Added new quiz successfully!"});
      }
   });
   
});


app.get('/getGames/:id', authenticate, (req, res) => {
   let email = req.query.email;
   let id = req.params.id;
   let Game;

   User.findOne({email:email}, (error, data) => {
      if(error) {
         console.log(error);
         res.status(500).send({Message: "There was an error while fetching the data from the DB"});
      }
      else {
         console.log(id);
         Game = data.games[id];
         res.status(200).send({Game: Game});
      }
   });
   
});

/// Start game ///

// Generates a gameId and sets the game's state to 1
app.get('/game/id/:gameindex', authenticate, (req, res) => {
   let userId = req.query.id;
   let gameIndex = req.params.gameindex;
   let arrGames;

   User.findOne({id:userId}, (error, data) => {
      if(error) console.log(error);
      else
      {
         arrGames = data.games;
         arrGames[gameIndex].Status = 1;
         User.updateOne({id:userId}, {games: arrGames}, (error) => {
            if(!error) console.log('Started game succesfully!');
         });
      }
   });
   res.status(200).send({gameId: `${userId}-${gameIndex}`});
});

/// Join Game ///
// Validates code from home screen
app.get('/game/isvalidcode', (req, res) => {
   let [userId, gameId] = req.query.code.split('-');
   User.findOne({id:userId}, (err, data) => {
      if(data == null || !(gameId < data.games.length)) res.status(200).send({valid : false});
      else { 
         console.log(data.games[gameId]);
         res.status(200).send({valid : data.games[gameId].Status == 1}); // only true if state == 1
      }
   });
});

// Validates user is unique and, if so, saves it to DB
app.put('/newplayer', (req, res) => {
   let body = req.body;
   let [userId, gameIndex] = req.query.code.split('-');
   let arrGames;

   User.findOne({id:userId}, (error, data) => {
      if(error) console.log(error);
      else
      {
         arrGames = data.games;

         let validUsername = true;
         arrGames[gameIndex].Players.forEach(player => {
            if(player.username == body.username) 
               validUsername = false;
         });

         if(!validUsername) {
            res.status(200).send({valid: false});
         } else {
            arrGames[gameIndex].Players.push(body);
            User.updateOne({id:userId}, {games: arrGames}, (error) => {
               if(!error) {
                  console.log('Unique player!');
                  res.status(200).send({valid: true});
               }
            });
         }
      }
   });


});

/// Tests ///
app.get('/tests', (req, res) => {

   User.findOne({email:'LapineMan@gmail.com'}, (error, data) => {
      if(error) console.log(error);
      else
      {
         User.updateOne({email:'billcypher@gmail.com'}, {games:data.games}, (e) => console.log(e));
         res.send('Updated!');
      }
   });

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