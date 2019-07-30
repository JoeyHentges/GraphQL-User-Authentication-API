const express = require('express');
const { checkKey, updateLastLogged } = require('../../tools');

const router = express.Router();

let updateLogged;

router.post('/update-last-logged-in', checkKey, async (req, res) => updateLogged(req.body, res));

// Update a user's last logged in value
updateLogged = async (body, res) => {
  const lastLogged = await updateLastLogged(body.id);

  res.send({
    status: 'success',
    lastLogged
  });
};

module.exports.routes = router;
module.exports.updateLastLogged = async id => updateLastLogged(id);
