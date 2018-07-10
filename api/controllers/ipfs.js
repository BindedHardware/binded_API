const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

//ipfs
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

async function uploadtoIpfs(dir, name){

  try{
  var files = await ipfs.util.addFromFs(dir + name);
  return files[0].hash;
  } 

  catch(error) {
      console.log(error);
  }
}


exports.upload = async (req, res, next) => {
    if(!req.file){
        console.log("400 no files");
        return res.status(400).send("no files")};

        console.log(req.file.originalname);
        var Hash = await uploadtoIpfs("./api/ipfsFile/", req.file.originalname);
        res.send(Hash);
  };
