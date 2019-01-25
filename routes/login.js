const {User} = require('../models/user_model');
const config = require('config');
const _ = require('lodash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send(error.details[0].message);
   
    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user,['_id', 'username', 'email']));
});

function validate(post) {
    const schema = {
        email: Joi.string().email().min(7).max(30).required(),
        password: Joi.string().min(5).max(256).required()
    };

    return Joi.validate(post, schema);
}

module.exports = router;