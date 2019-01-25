const Joi = require('joi');
const mongoose = require('mongoose');

function validatePost(post) {
    const schema = {
        content: Joi.string().min(1).max(3000).required(),
    };

    return Joi.validate(post, schema);
}

const Post = mongoose.model('Post',  new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 3000,
        validate: {
            validator: function(v) {
                var re = /^[a-zA-Z0-9.,!#$()&'"@ ]+$/;
                return (v != null || v.trim().length > 1) || re.test(v)
            },
            message: 'Invalid Post!\nPost must only letters, digit and punctuations!\nPost must not be empty!'
        }
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}));

exports.Post = Post;
exports.validate = validatePost;