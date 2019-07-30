const express = require('express');
const { graphql } = require('graphql');
const {
  checkKey, checkQuery, updateLogs, verifyEmail, nodemailer
} = require('../../tools');
const { AccountVerificationResolvers } = require('../controllers/resolvers/AccountVerification.resolvers');
const { AccountVerificationTypedefs } = require('../controllers/typeDefs/AccountVerification.typedefs');
const { userResolvers, userTypedefs } = require('../../User/user.exports');

const router = express.Router();

let getAccountVerification;
let accountVerified;
let sendAccountVerification;

router.get('/account-verification', checkKey, async (req, res) => getAccountVerification(req.body, res));
router.post('/account-verification', checkKey, async (req, res) => accountVerified(req.body, res));
router.post('/send-account-verification', checkKey, async (req, res) => sendAccountVerification(req.body, res));

// Get an account verification by its id
getAccountVerification = async (body, res) => {
  const result = await graphql(AccountVerificationTypedefs,
    `{ getAccountVerificationById(id: "${body.id}") { ${body.values} } }`,
    AccountVerificationResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getAccountVerificationById);
};

// Update an admin or user document to reflect their account is verified
let updateUser;
accountVerified = async (body, res) => {
  // parameters
  const {
    verificationId, id
  } = body;

  updateUser(verificationId, id);

  res.send({
    status: 'success'
  });
};

// send an account verification email
let sendEmail;
sendAccountVerification = async (body, res) => {
  // parameters
  const {
    id, username, email, firstName
  } = body;

  await sendEmail(res, id, username, email, firstName);

  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

updateUser = async (verificationId, id) => {
  // Update User doc
  await graphql(userTypedefs,
    `mutation{ updateUser(id: "${id}", updateVariable: "accountVerified", updateValue: "true") {id} }`,
    userResolvers.Mutation).then(response => response.data.updateUser);

  // Update Account Verification doc
  await graphql(AccountVerificationTypedefs,
    `mutation{ updateFulfilled(id: "${verificationId}") {id} }`,
    AccountVerificationResolvers.Mutation).then(response => response.data.updateFulfilled);

  updateLogs('User', id, 'authentication', 5);
};

// update the database and send the email
sendEmail = async (res, id, username, email, firstName) => {
  // Create Account Verification document - used in verifying account
  const verificationId = await graphql(AccountVerificationTypedefs,
    `mutation{ createAccountVerification(model: "User", userId: "${id}", userFirstName: "${firstName}", userUsername: "${username}") {id} }`,
    AccountVerificationResolvers.Mutation)
    .then(response => response.data.createAccountVerification);

  const mailOptions = {
    from: `${process.env.NODEMAILER_NOREPLY_SENDER_USER}`,
    to: `${email}`,
    subject: `${process.env.LEAD_COMPANY_NAME} Email Verification | ${username}`,
    text: 'Message Sent!',
    html: verifyEmail(
      process.env.LEAD_COMPANY_NAME,
      firstName,
      `http://localhost:4000/verify-account/${verificationId.id}`
    )
  };
  nodemailer(res, mailOptions);
};
