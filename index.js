const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const login = require('./routes/login');
const logout = require('./routes/logout');
const moderator = require('./routes/moderator');
const new_account = require('./routes/new_account');
const post = require('./routes/post');
const posts = require('./routes/posts');
const user = require('./routes/user');

if(!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: IMPORTANT ENV VAR MISSING!');
  process.exit(1);
}

if(!config.get('referralKey')) {
  console.error('FATAL ERROR: IMPORTANT ENV VAR MISSING!');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/websecurity', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/login', login);
app.use('/logout', logout);
app.use('/moderator', moderator);
app.use('/new_account', new_account);
app.use('/post', post);
app.use('/posts', posts);
app.use('/user', user);



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get('/', (req, res) => {
    res.send('Web-Security Project');
})
