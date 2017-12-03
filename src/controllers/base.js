'use strict';

exports.sendValidationError = function(res, message) {
  return res.status(409).json({
    'success': false,
    'message': message
  });
};
