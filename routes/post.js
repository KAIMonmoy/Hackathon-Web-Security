const {Post, validate} = require('../models/post_model');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const adminOrModerator = require('../middlewares/adminOrModerator');
const express = require('express');
const router = express.Router();

router.post('/new', auth, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let post = new Post({ 
        content: req.body.content,
        isApproved: false,
        postedBy: req.user._id
    });
    post = await post.save();
    
    res.send(post);
});

router.put('/:id/update', auth, async (req, res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const oldPost = await Post.findById(req.params.id);
    if (!oldPost) return res.status(404).send('Post with the given ID was not found.');

    if((req.user._id != oldPost.postedBy) && !req.user.isAdmin) {
        return res.status(403).send('Access Denied!');
    }

    let post = await Post.findByIdAndUpdate(req.params.id, { 
        content: req.body.content,
        isApproved: false
    }, {new : true});
    
    post = await post.save();
    res.send(post);
});

router.get('/:id', auth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post with the given ID was not found.');

    if(req.user.isAdmin || req.user.isModerator) {
        res.send(post);
    } else {
        if(post.isApproved) {
            res.send(post);
        } else {
            if(post.postedBy != req.user._id) {
                res.status(403).send('The post has not been approved yet!');
            } else {
                res.send(post);
            }
        }
    }

    
});

router.put('/:id/approve', [auth, adminOrModerator], async (req, res) => {

    let post = await Post.findByIdAndUpdate(req.params.id, { 
        isApproved: true
    }, {new : true});
    
    if (!post) return res.status(404).send('Post with the given ID was not found.');
    post = await post.save();

    res.send(post);
});

router.delete('/:id/delete',  [auth, adminOrModerator], async (req, res) => {
    const post = await Post.findByIdAndRemove(req.params.id);

    if (!post) return res.status(404).send('Post with the given ID was not found.');

    res.send(post);
});

module.exports = router;