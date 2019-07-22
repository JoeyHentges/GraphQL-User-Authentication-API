const { checkKey } = require('../main/controllers/api-tools/check-key');
const { checkValues } = require('../main/controllers/api-tools/check-values');
const { checkQuery } = require('../main/controllers/api-tools/check-query');
const { updateLogs } = require('../main/controllers/tools/update.logs');
const { updateLastLogged } = require('../main/controllers/tools/update.LastLoggedIn');
const nodemailer = require('../main/controllers/tools/nodemailer');
// Email Templates
const { verifyEmail } = require('../main/views/email.templates/verify.email');
const { passwordResetEmail } = require('../main/views/email.templates/passwordReset.email');

module.exports = {
  checkKey,
  checkValues,
  checkQuery,
  updateLogs,
  updateLastLogged,
  nodemailer,
  verifyEmail,
  passwordResetEmail
};
