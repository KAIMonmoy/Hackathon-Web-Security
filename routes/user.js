const {User} = require('../models/user_model');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const config = require('config');
const _ = require('lodash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

function validate(user) {
    const schema = {
        username: Joi.string().min(1).max(15).required()
    };

    return Joi.validate(user, schema);
}


router.get('/:id/profile', auth, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User with the given ID was not found.');
    res.send(_.pick(user,['username', 'email', 'isAdmin', 'isModerator']));
});

router.put('/:id/profile/update', auth, async (req, res) => {

    if(!req.user.isAdmin && req.user._id != req.params.id) {
        return res.status(403).send('Access Denied');
    }

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const oldUser = await User.findById(req.params.id);
    if (!oldUser) return res.status(404).send('User with the given ID was not found.');

    let user = await User.findByIdAndUpdate(req.params.id, { 
        username: req.body.username
    }, {new : true});
    
    user = await user.save();
    res.send(user);
});

router.delete('/:id/delete',  [auth, admin], async (req, res) => {
    
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('User with the given ID was not found.');
    if(req.params.id == req.user._id) {
        res.header('x-auth-token', "null").send(user);
    } else {
        res.send(user);
    }
    
});





module.exports = router;