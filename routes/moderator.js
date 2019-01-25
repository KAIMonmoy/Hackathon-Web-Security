const {User} = require('../models/user_model');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// function validate(command) {
//     const schema = {
//         isModerator: Joi.boolean().required()
//     };

//     return Joi.validate(command, schema);
// }

router.put('/upgrade/:id', [auth, admin], async (req, res) => {

    // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);

    const oldUser = await User.findById(req.params.id) ;
    if (!oldUser) return res.status(404).send('User with the given ID was not found.');


    let user = await User.findByIdAndUpdate(req.params.id, { 
        isModerator: true,
    }, {new : true});
    
    user = await user.save();
    res.send(_.pick(user,['username', 'email', 'isModerator']));
});

router.put('/downgrade/:id', [auth, admin], async (req, res) => {

    // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);

    const oldUser = User.findById(req.params.id);
    if (!oldUser) return res.status(404).send('User with the given ID was not found.');

    let user = await User.findByIdAndUpdate(req.params.id, { 
        isModerator: false,
    }, {new : true});
    
    user = await user.save();
    res.send(_.pick(user,['username', 'email', 'isModerator']));
});

module.exports = router;