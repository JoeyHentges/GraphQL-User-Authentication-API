const { graphql } = require('graphql');
const express = require('express');
const { checkKey, checkQuery } = require('../../tools');
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');

const router = express.Router();

let getUserById;
let getUserByUsername;
let getUserByEmail;
let getUsers;

router.get('/id', checkKey, async (req, res) => getUserById(req.body, res));
router.get('/username', checkKey, async (req, res) => getUserByUsername(req.body, res));
router.get('/email', checkKey, async (req, res) => getUserByEmail(req.body, res));
router.get('/all', checkKey, async (req, res) => getUsers(req.body, res));

// Get the User by its ID
getUserById = async (body, res) => {
  const result = await graphql(userTypedefs,
    `{ getUserById(id: "${body.id}") { ${body.values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUserById);
};

// Get the User by its Username
getUserByUsername = async (body, res) => {
  const result = await graphql(userTypedefs,
    `{ getUserByUsername(username: "${body.username}") { ${body.values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  result.getUserByUsername.password = undefined;
  res.send(result.getUserByUsername);
};

// Get the User by its Email
getUserByEmail = async (body, res) => {
  const result = await graphql(userTypedefs,
    `{ getUserByEmail(email: "${body.email}") { ${body.values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  result.getUserByEmail.password = undefined;
  res.send(result.getUserByEmail);
};

// Get all of the Users
getUsers = async (body, res) => {
  let values = body.values;
  if (body.values.includes('password')) {
    const valA = body.values.split(' ');
    valA.splice(valA.indexOf('password'), 1);
    values = valA.join(' ');
  }

  const result = await graphql(userTypedefs,
    `{ getUsers { ${values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUsers);
};

module.exports.routes = router;
