const { dbs } = require('../../configs');

module.exports.AccountVerification = dbs.db1().model('AccountVerifcation', {
  fulfilled: Boolean,
  userId: String,
  userFirstName: String,
  userUsername: String,
  expirationDate: Date
});
