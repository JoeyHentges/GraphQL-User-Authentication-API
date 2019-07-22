const bcrypt = require('bcrypt');
const { graphql } = require('graphql');
const express = require('express');
const { checkKey } = require('../../tools');
const { userResolvers } = require('../controllers/resolvers/user.resolvers');
const { userTypedefs } = require('../controllers/typeDefs/user.typedefs');

const router = express.Router();

let deleteDoc;

router.delete('/delete', checkKey, async (req, res) => deleteDoc(req.query, res));

let getUser;
let deleteUser;
deleteDoc = async (query, res) => {
  // parameters
  const {
    username, password
  } = query;

  // get some values
  const result = await getUser(username);

  // check if passwords match
  if (!(await bcrypt.compare(password, result.password))) {
    res.send({
      status: 'failure',
      reason: 'passwords do not match'
    });
    return;
  }

  // delete the user
  deleteUser(result.id);

  res.send({
    status: 'success'
  });
};

// get the user password and id
getUser = async username => graphql(userTypedefs,
  `{ getUserByUsername(username: "${username}") { id password } }`,
  userResolvers.Query).then(response => response.data.getUserByUsername);

// delete the user by its id
deleteUser = async id => userResolvers.Mutation.deleteUser(id);

module.exports.routes = router;
