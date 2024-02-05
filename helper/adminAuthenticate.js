module.exports = function (req, res, next) {
    console.log('first',req.user.role)
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      next({
        msg: 'Unauthorized',
        status: 403
      })
    }
}