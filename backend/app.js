const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const postsRoutes = require('./routes/posts');

const pw = 'wcLfCioxyXom5BJA';
const posts = [
  {
    id: '3234t3248hf',
    title: 'First Server-side post',
    content: 'This is coming from the server.'
  },
  {
    id: '0784rwjf03734',
    title: 'Second Server-side post',
    content: 'This is coming from the server!'
  }
];

mongoose.connect('mongodb+srv://app:'+pw+'@meancluster-nqwcq.mongodb.net/meanApp?retryWrites=true')
.then(() => {
  console.log('Connected.');
})
.catch(() => {
  console.log('Not Connected!');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods',
  'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts' , postsRoutes);

module.exports = app;
