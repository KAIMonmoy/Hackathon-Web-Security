const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, (req, res) => {
    res.header('x-auth-token', "null").send("Logout Successful!");
});

module.exports = router;