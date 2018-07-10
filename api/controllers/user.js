const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

// config
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/teochFL5M5Cc6eidkmI5"));
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('https://rinkeby.infura.io/teochFL5M5Cc6eidkmI5');

exports.signUp = (req, res, next) =>{
  User.find({email:req.body.email})
    .exec()
    .then(user => {
      if(user.length){
        return res.status(409).json({
          message: 'Mail exists'
        });
      } else{
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err){
            return res.status(500).json({
              error: err
            });
          } else{
            var info = web3.eth.accounts.create();
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              account: info.address,
              privatekey: info.privateKey
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error:err
                });
              });
            }
        });
      }
    })
}

exports.logIn = (req, res, next) => {
  User.find({email:req.body.email})
    .exec()
    .then(user => {
      if(user.length < 1){
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if(err) {
          return res.status(401).json({
            message:'Auth failed'
          });
        }
        if (result){
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
          },
          "secretToken",
          {
            expiresIn: "1h"
          }
        );
          return res.status(200).json({
            message: 'Auth succesful',
            token:token,
            account: user[0].account
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.deleteId = (req, res, next) => {
  User.findOneAndRemove({ _id: req.params.userId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}