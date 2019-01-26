const {Post} = require('../models/post_model');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {

    if(req.user.isAdmin || req.user.isModerator) {
        const all_posts = await Post.find();
        return res.send(all_posts);
    }

    const approved_posts = await Post.find({isApproved: true});
    const my_posts = await Post.find({postedBy: req.user._id});

    res.send({approvedPosts: approved_posts, myPosts: my_posts});
});

module.exports = router;