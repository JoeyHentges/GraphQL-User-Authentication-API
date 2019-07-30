const express = require('express');
const multer = require('multer');
const { checkKey } = require('../../tools');
const { User } = require('../models/User');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

let updateUser;

router.post('/update', checkKey, upload.single('file'), async (req, res) => updateUser(req.body, req.file, res));

// update an User value
updateUser = async (body, file, res) => {
  // parameters
  const {
    id, variable
  } = body;
  let { value } = body;

  if (value === 'image') {
    value = `data:image/jpeg;base64,${file.buffer.toString('base64')}`;
  }

  if (value === 'array') {
    await handleArray(body);
  } else if (value === 'array-delete') {
    await handleArrayDelete(body);
  } else {
    // update the User doc
    await User.findByIdAndUpdate(id,
      { $set: { [variable]: value } },
      { new: true })
      .then(result => result);
  }
  res.send({
    status: 'success'
  });
};

module.exports.routes = router;

// handle an array element update
handleArray = async (body) => {
  // parameters
  const {
    id, array, arrayIdentifier, identifier
  } = body;
  const arrayValue = body;
  // const newArray = splitArray(arrayValue);
  // update
  for (let i = 0; i < arrayValue.length; i += 1) {
    const newVariable = `${array}.$.${arrayValue[i].variable}`;
    User.update(
      { _id: id, [`${array}.${arrayIdentifier}`]: identifier },
      { $set: { [newVariable]: arrayValue[i].value } },
      { new: true }
    ).then(result => result);
  }
};

// handle an array deletion
handleArrayDelete = async (body) => {
  // parameters
  const {
    id, array, arrayIdentifier, identifier
  } = body;
  await User.findByIdAndUpdate(id,
    { $pull: { [array]: { [arrayIdentifier]: identifier } } }, { safe: true });
}