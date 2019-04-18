const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const Post = require('./models/post');

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
  'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
  .then(createdPost => {
    res.status(201).json({
      message: 'Post added!',
      postId: createdPost._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
  .then(docs => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: docs
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id}).then(
    res.status(200).json({ message: 'Post Deleted.' })
  );
});

module.exports = app;
