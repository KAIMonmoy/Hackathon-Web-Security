const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');

function validateUser(user) {
    const schema = {
        username: Joi.string().min(1).max(15).required(),
        email: Joi.string().email().min(7).max(30).required(),
        password: Joi.string().min(5).max(256).required(),
        isAdmin: Joi.boolean().required(),
        isModerator: Joi.boolean().required(),
        referralCode: Joi.string().allow("")
    };

    if(Boolean(user.isAdmin) === true || Boolean(user.isModerator) === true) {
        if(user.referralCode !== config.get("referralKey")) {
            return false;
        }
    }

    return Joi.validate(user, schema);
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15,
        validate: {
            validator: function(v) {
                var re = /^[a-zA-Z0-9_]+$/;
                return (v != null || v.trim().length > 1) || re.test(v)
            },
            message: 'Invalid Username!'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 30,
        validate: {
            validator: function(v) {
                var re = /^[a-zA-Z0-9_@.]+$/;
                return (v != null || v.trim().length > 1) || re.test(v)
            },
            message: 'Invalid Mail Address!'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 256,
        validate: {
            validator: function(v) {
                var re = /^[a-zA-Z0-9_@.!@# ,&]+$/;
                return (v != null || v.trim().length > 1) || re.test(v)
            },
            message: 'Invalid Password!\nEnter Valid Characters!'
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isModerator: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin, isModerator: this.isModerator}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validate = validateUser;