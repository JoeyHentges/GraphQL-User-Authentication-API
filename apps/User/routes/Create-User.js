const { graphql } = require('graphql');
const express = require('express');
const { checkKey } = require('../../tools');
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');

const router = express.Router();

let createUser;

router.post('/create', checkKey, async (req, res) => createUser(req.body, res));

// Create the user document
let checkForUsername;
let createUserAccount;
let checkForEmail;
createUser = async (body, res) => {
  // parameters
  const {
    firstName, lastName, email, username, password,
    securityQuestionOne, securityQuestionOneAnswer,
    securityQuestionTwo, securityQuestionTwoAnswer,
    securityQuestionThree, securityQuestionThreeAnswer
  } = body;

  // Check for the username
  if (!(await checkForUsername(username))) {
    res.send({
      status: 'username in use'
    });
    return;
  }

  // Check for the email
  if (!(await checkForEmail(email))) {
    res.send({
      status: 'email in use'
    });
    return;
  }

  // Create the user
  await createUserAccount(
    firstName, lastName, email, username, password,
    securityQuestionOne, securityQuestionOneAnswer,
    securityQuestionTwo, securityQuestionTwoAnswer,
    securityQuestionThree, securityQuestionThreeAnswer
  );

  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

// Check for an existing account with that username.
checkForUsername = async (username) => {
  const result = await graphql(userTypedefs,
    `{ getUserByUsername(username: "${username}") {id} }`,
    userResolvers.Query).then(response => response.data.getUserByUsername);
  if (result === null || result === undefined) {
    return true;
  }
  return false;
};

// Check for an existing account with that email.
checkForEmail = async (email) => {
  const result = await graphql(userTypedefs,
    `{ getUserByEmail(email: "${email}") {id} }`,
    userResolvers.Query).then(response => response.data.getUserByEmail);
  if (result === null || result === undefined) {
    return true;
  }
  return false;
};

// Create the user.
createUserAccount = async (
  firstName, lastName, email, username, password,
  securityQuestionOne, securityQuestionOneAnswer,
  securityQuestionTwo, securityQuestionTwoAnswer,
  securityQuestionThree, securityQuestionThreeAnswer
) => {
  await userResolvers.Mutation.createUser({
    firstName,
    lastName,
    email,
    username,
    password,
    securityQuestionOne,
    securityQuestionOneAnswer,
    securityQuestionTwo,
    securityQuestionTwoAnswer,
    securityQuestionThree,
    securityQuestionThreeAnswer
  });
  return true;
};
