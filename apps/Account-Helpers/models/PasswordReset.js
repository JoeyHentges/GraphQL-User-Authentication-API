const { dbs } = require('../../configs');

module.exports.PasswordReset = dbs.db1().model('PasswordReset', {
  fulfilled: Boolean,
  userId: String,
  expirationDate: Date
});
