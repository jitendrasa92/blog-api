var bcrypt = require('bcryptjs');

var config = require('../config/config');

/**
 * Create a hash for a string.
 *
 */

exports.hash = async (req, res) => {
  const saltRounds = config.auth.saltRounds;
  return bcrypt.hash(req, saltRounds);
}

/**
 * Compare a string with the hash.
 *
 */
exports.compare = async (req, hashedValue) => {
  return bcrypt.compare(req, hashedValue);
}
