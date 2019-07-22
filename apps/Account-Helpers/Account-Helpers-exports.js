// Exporting the Account Helper models, resolvers and typedefs.
// This is for use outside this app. Makes it eaiser to grab the needed items

const { AccountVerification } = require('./models/AccountVerification');
const { AccountVerificationResolvers } = require('./controllers/resolvers/AccountVerification.resolvers');
const { AccountVerificationTypedefs } = require('./controllers/typeDefs/AccountVerification.typedefs');

const { PasswordReset } = require('./models/PasswordReset');
const { PasswordResetResolvers } = require('./controllers/resolvers/PasswordReset.resolvers');
const { PasswordResetTypedefs } = require('./controllers/typeDefs/PasswordReset.typedefs');

// Other Helper Fuctions
const { lockAccount } = require('./routes/Lock-Account');
const { updateLogs } = require('./routes/Update-Logs');
const { updateLastLogged } = require('./routes/Update-Last-Logged-In');

const contents = {
  // Account Verifications
  AccountVerification,
  AccountVerificationResolvers,
  AccountVerificationTypedefs,
  // Password Resets
  PasswordReset,
  PasswordResetResolvers,
  PasswordResetTypedefs,
  // Other
  lockAccount,
  updateLogs,
  updateLastLogged
};

module.exports = contents;
