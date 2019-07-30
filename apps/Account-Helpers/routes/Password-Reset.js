const bcrypt = require('bcrypt');
const express = require('express');
const { graphql } = require('graphql');
const {
  checkKey, checkQuery, updateLogs, nodemailer, passwordResetEmail
} = require('../../tools');
const { PasswordResetResolvers } = require('../controllers/resolvers/PasswordReset.resolvers');
const { PasswordResetTypedefs } = require('../controllers/typeDefs/PasswordReset.typedefs');
const { userResolvers, userTypedefs } = require('../../User/user.exports');

const router = express.Router();

let getPasswordReset;
let sendPasswordReset;
let resetPassword;

router.get('/password-reset', checkKey, async (req, res) => getPasswordReset(req.body, res));
router.post('/send-password-reset', checkKey, async (req, res) => sendPasswordReset(req.body, res));
router.post('/password-reset', checkKey, async (req, res) => resetPassword(req.body, res));

// Get a password reset by its id
getPasswordReset = async (body, res) => {
  const result = await graphql(PasswordResetTypedefs,
    `{ getPasswordResetById(id: "${body.id}") { ${body.values} } }`,
    PasswordResetResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getPasswordResetById);
};

// send a password reset email
let sendPasswordResetEmail;
sendPasswordReset = async (body, res) => {
  // parameters
  const {
    email
  } = body;

  // Get the user values
  const result = await graphql(userTypedefs,
    `{ getUserByEmail(email: "${email}") {id locked firstName username} }`,
    userResolvers.Query).then(response => response);

  // Handle a bad email
  if (
    result.data.getUserByEmail === null
  ) {
    res.send({
      status: 'failure',
      reason: 'bad email'
    });
    return;
  }

  // update the database and send the password reset email
  await sendPasswordResetEmail(
    res,
    result.data.getUserByEmail.id,
    result.data.getUserByEmail.username,
    result.data.getUserByEmail.firstName,
    email
  );

  res.send({
    status: 'success'
  });
};

// reset a password
let checkSecurityQuestions;
let updateUser;
resetPassword = async (body, res) => {
  // parameters
  const {
    id, userId, newPassword,
    questionOne, questionOneAnswer,
    questionTwo, questionTwoAnswer
  } = body;

  // Get the user values
  const questions = await graphql(userTypedefs,
    `{ getUserById(id: "${userId}") {securityQuestions} }`,
    userResolvers.Query).then(response => response.data.getUserById);
  console.log(userId);
  // check the security questions
  if (
    !(await checkSecurityQuestions(
      questionOne,
      questionTwo,
      questions.securityQuestions,
      questionOneAnswer,
      questionTwoAnswer
    ))
  ) {
    res.send({
      status: 'failure',
      reason: 'security questions incorrect'
    });
    return;
  }

  await updateUser(
    id,
    userId,
    newPassword
  );

  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

// For sending a password reset email
sendPasswordResetEmail = async (res, id, username, firstName, email) => {
  // Create Account Verification document - used in verifying account
  const passwordResetId = await graphql(PasswordResetTypedefs,
    `mutation{ createPasswordReset(userId: "${id}", userFirstName: "${firstName}", userUsername: "${username}") {id} }`,
    PasswordResetResolvers.Mutation).then(response => response.data.createPasswordReset);

  const mailOptions = {
    from: `${process.env.NODEMAILER_NOREPLY_SENDER_USER}`,
    to: `${email}`,
    subject: `${process.env.COMPANY_NAME} Password Reset | ${username}`,
    text: 'Message Sent!',
    html: passwordResetEmail(
      process.env.COMPANY_NAME,
      firstName,
      `http://localhost:4000/password-reset/${passwordResetId.id}`
    )
  };
  nodemailer(res, mailOptions);
};

// Check to see if the security question answers entered are correct
checkSecurityQuestions = async (
  questionOne,
  questionTwo,
  securityQuestions,
  answerOne,
  answerTwo
) => {
  let questionOneAnswer;
  let questionTwoAnswer;
  if ((`${questionOne}?`) === securityQuestions.questionOne.question) {
    questionOneAnswer = securityQuestions.questionOne.answer;
  }
  if ((`${questionOne}?`) === securityQuestions.questionTwo.question) {
    questionOneAnswer = securityQuestions.questionTwo.answer;
  }
  if ((`${questionOne}?`) === securityQuestions.questionThree.question) {
    questionOneAnswer = securityQuestions.questionThree.answer;
  }
  if ((`${questionTwo}?`) === securityQuestions.questionOne.question) {
    questionTwoAnswer = securityQuestions.questionOne.answer;
  }
  if ((`${questionTwo}?`) === securityQuestions.questionTwo.question) {
    questionTwoAnswer = securityQuestions.questionTwo.answer;
  }
  if ((`${questionTwo}?`) === securityQuestions.questionThree.question) {
    questionTwoAnswer = securityQuestions.questionThree.answer;
  }
  if (
    questionOneAnswer.toUpperCase() === answerOne.toUpperCase()
    && questionTwoAnswer.toUpperCase() === answerTwo.toUpperCase()
  ) {
    return true;
  }
  return false;
};

// update a user
updateUser = async (passwordResetId, id, password) => {
  // Update User doc
  const newPassword = await bcrypt
    .hash(password, 10)
    .then(hash => hash);

  const userResult = await graphql(userTypedefs,
    `mutation{ updateUser(id: "${id}", updateVariable: "password", updateValue: "${newPassword}") {id locked} }`,
    userResolvers.Mutation).then(response => response.data.updateUser);

  // Check for the account being locked, and if so, unlock it
  if (userResult.locked) {
    await graphql(userTypedefs,
      `mutation{ updateUser(id: "${id}", updateVariable: "locked", updateValue: "false") {id} }`,
      userResolvers.Mutation).then(response => response.data.updateUser);
    updateLogs('User', id, 'authentication', 7);
  }

  // Update Password Reset doc
  await graphql(PasswordResetTypedefs,
    `mutation{ updateFulfilled(id: "${passwordResetId}") {id} }`,
    PasswordResetResolvers.Mutation).then(response => response.data.updateFulfilled);

  updateLogs('User', id, 'authentication', 6);
};
