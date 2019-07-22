const express = require('express');
const { checkKey, updateLogs } = require('../../tools');

const router = express.Router();

let addLogs;

router.post('/update-logs', checkKey, async (req, res) => addLogs(req.query, res));

// Update the logs for a Company, Admin or User
addLogs = async (query, res) => {
  await updateLogs(
    query.id, query.type, query.messageNumber, query.logValue
  );

  res.send({
    status: 'success'
  });
};

module.exports.routes = router;
module.exports.updateLogs = async (
  id, type, messageNumber, logValue
) => updateLogs(id, type, messageNumber, logValue);
