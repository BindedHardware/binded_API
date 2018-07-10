const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');
//const User = require('../models/ipfs');
const controllerIpfs = require('../controllers/ipfs');

const multer = require('multer');

var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, './api/ipfsFile/');
    },
    filename: function(req, file, cb){
      cb(null,file.originalname);
    }
  });

  const upload = multer({storage: storage});


router.post('/upload', upload.single('tfmodel'), controllerIpfs.upload);


module.exports = router;