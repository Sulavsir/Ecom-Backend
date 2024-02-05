module.exports = function (req, res, next) {
    console.log('first',req.user.role)
    if (req.user && req.user.role === 'CLIENT') {
      next();
    } else {
      next({
        msg: 'You dont have access',
        status: 403
      })
    }
}