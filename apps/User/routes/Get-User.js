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

router.get('/id', checkKey, async (req, res) => getUserById(req.query, res));
router.get('/username', checkKey, async (req, res) => getUserByUsername(req.query, res));
router.get('/email', checkKey, async (req, res) => getUserByEmail(req.query, res));
router.get('/all', checkKey, async (req, res) => getUsers(req.query, res));

// Get the User by its ID
getUserById = async (query, res) => {
  const result = await graphql(userTypedefs,
    `{ getUserById(id: "${query.id}") { ${query.values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUserById);
};

// Get the User by its Username
getUserByUsername = async (query, res) => {
  const result = await graphql(userTypedefs,
    `{ getUserByUsername(username: "${query.username}") { ${query.values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUserByUsername);
};

// Get the User by its Email
getUserByEmail = async (query, res) => {
  const result = await graphql(userTypedefs,
    `{ getUserByEmail(email: "${query.email}") { ${query.values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUserByEmail);
};

// Get all of the Users
getUsers = async (query, res) => {
  const result = await graphql(userTypedefs,
    `{ getUsers { ${query.values} } }`,
    userResolvers.Query).then(response => response.data);

  if (checkQuery(result, res)) {
    return;
  }
  res.send(result.getUsers);
};

module.exports.routes = router;
