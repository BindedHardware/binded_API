const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// const productRoutes = require('./api/routes/products');
// const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const ipfsRoutes = require('./api/routes/ipfs');

// db connection 
mongoose.connect('mongodb+srv://haohaowaski:apple911124@cluster0-6uttc.mongodb.net/test?retryWrites=true', {useNewUrlParser: true})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','*');

  if(req.method === 'OPTIONS'){
      res.header('Acess-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
      return res.status(200).json({});
  }
  next();
});

// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/ipfs', ipfsRoutes);


app.use((req, res, next) =>{
  const error = new Error("Not Found");
  error.status= 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
});

module.exports = app;
