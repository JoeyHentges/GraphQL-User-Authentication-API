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
  const userVals = await getUser(body.username, body.getValues);

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
    id, disabled, locked, password
  } = userVals;

  // check if passwords match
  if (!(await bcrypt.compare(body.password, userVals.password))) {
    await lockAccount(id, logs, true);
    await updateLogs(id, 'authentication', 2);
    res.send({
      status: 'failure',
      reason: 'passwords do not match'
    });
    return;
  }

  const check = await checkAccount(userVals.id, userVals.disabled, userVals.locked);

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

  userVals.password = undefined;
  res.send({
    status: 'success',
    values: userVals
  });
};

module.exports.routes = router;

// get the user password and id
getUser = async (username, getValues) => {
  if (!getValues.includes('id')) {
    getValues += ' id'
  }
  if (!getValues.includes('disabled')) {
    getValues += ' disabled'
  }
  if (!getValues.includes('locked')) {
    getValues += ' locked'
  }
  if (!getValues.includes('password')) {
    getValues += ' password'
  }

  const result = await graphql(userTypedefs,
  `{ getUserByUsername(username: "${username}") { ${getValues} } }`,
  userResolvers.Query).then(response => response.data.getUserByUsername);

  return result;
}

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
