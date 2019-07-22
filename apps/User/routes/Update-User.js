const express = require('express');
const multer = require('multer');
const { checkKey } = require('../../tools');
const { User } = require('../models/User');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

let updateUser;

router.post('/update', checkKey, upload.single('file'), async (req, res) => updateUser(req.query, req.file, res));

// update an User value
updateUser = async (query, file, res) => {
  // parameters
  const {
    id, variable
  } = query;
  let { value } = query;

  if (variable === 'profilePage.image') {
    value = `data:image/jpeg;base64,${file.buffer.toString('base64')}`;
  }

  // update the User doc
  User.findByIdAndUpdate(id,
    { $set: { [variable]: value } },
    { new: true })
    .then(result => result);

  res.send({
    status: 'success'
  });
};

module.exports.routes = router;
