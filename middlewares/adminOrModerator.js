

module.exports = function (req, res, next) {
    if(!req.user.isAdmin && !req.user.isModerator) return res.status(403).send('Access Denied!');
    next();
}