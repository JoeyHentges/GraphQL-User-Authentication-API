const express = require('express');
const { checkKey, updateLogs } = require('../../tools');

const router = express.Router();

let addLogs;

router.post('/update-logs', checkKey, async (req, res) => addLogs(req.body, res));

// Update the logs for a Company, Admin or User
addLogs = async (body, res) => {
  await updateLogs(
    body.id, body.type, body.messageNumber, body.logValue
  );

  res.send({
    status: 'success'
  });
};

module.exports.routes = router;
module.exports.updateLogs = async (
  id, type, messageNumber, logValue
) => updateLogs(id, type, messageNumber, logValue);
