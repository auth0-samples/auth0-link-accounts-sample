/**
 * This middleware checks if there is an `error` param within the callback url query string.
 * It there is, it calls next with an error.
 *
 * @return {Function}
 * @api public
 */
module.exports = function handleCallbakError() { 
  return function(req, res, next) {
    console.log('req.query.err',req.query.error);
    if (req.query.error){
      return next(new Error(req.query.error +': '+req.query.error_description));
    }
    next();
  };
};
