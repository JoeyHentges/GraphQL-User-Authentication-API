const bcrypt = require('bcrypt');
const { graphql } = require('graphql');
const express = require('express');
const { checkKey } = require('../../tools');
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');
const {
  lockAccount, updateLogs, updateLastLogged
} = require('../../Account-Helpers/Account-Helpers-exports');

const router = express.Router();

let userSignIn;

router.post('/sign-in', checkKey, async (req, res) => userSignIn(req.body, res));

let getUser;
let checkAccount;
let updateDatabase;
userSignIn = async (body, res) => {
  // get some values
  const userVals = await getUser(body.username);

  // username incorrect
  if (userVals === null) {
    res.send({
      status: 'failure',
      reason: 'passwords do not match'
    });
    return;
  }

  // destructure the values
  const {
    id, firstName, lastName, email, locked, disabled, password, logs
  } = userVals;

  // check if passwords match
  if (!(await bcrypt.compare(body.password, password))) {
    await lockAccount(id, logs, true);
    await updateLogs(id, 'authentication', 2);
    res.send({
      status: 'failure',
      reason: 'passwords do not match'
    });
    return;
  }

  const check = await checkAccount(id, disabled, locked);

  // other account checks
  if (check === 'disabled') {
    res.send({
      status: 'failure',
      reason: 'account disabled'
    });
    return;
  } if (check === 'locked') {
    res.send({
      status: 'failure',
      reason: 'account disabled'
    });
    return;
  }

  // successfully logged in - update some values in the user doc
  const lastLogged = await updateDatabase(id);

  res.send({
    status: 'success',
    id,
    firstName,
    lastName,
    email,
    locked,
    lastLogged
  });
};

module.exports.routes = router;

// get the user password and id
getUser = async username => graphql(userTypedefs,
  `{ getUserByUsername(username: "${username}") { id firstName lastName email locked disabled password logs } }`,
  userResolvers.Query).then(response => response.data.getUserByUsername);

// check the account is allowed to login
checkAccount = async (id, disabled, locked) => {
  if (locked || disabled) {
    let number;
    if (disabled) {
      number = 4;
    } else {
      number = 3;
    }
    // Update the user's logs
    await updateLogs(id, 'authentication', number);
  }

  if (locked) {
    if (disabled) {
      return 'disabled';
    }
    return 'locked';
  }

  return 'login successful';
};

// update the database, and get he users last logged in date
updateDatabase = async (id) => {
  // update the users logs
  await updateLogs(id, 'authentication', 1);

  // Update the user's last logged in
  return updateLastLogged(id);
};
