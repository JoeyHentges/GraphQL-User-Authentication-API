const express = require('express');
const { User } = require('../../User/user.exports');
const { checkKey, updateLogs } = require('../../tools');

const router = express.Router();

let lockAccount;

router.post('/lock-account', checkKey, async (req, res) => lockAccount(req.body, res));

// lock some users account
let updateAccount;
lockAccount = async (body, res) => {
  // parameters
  const {
    id, logs, lock
  } = body;

  res.send({
    locked: updateAccount(id, logs, lock)
  });
};

module.exports.routes = router;
module.exports.lockAccount = async (id, logs) => updateAccount(id, logs, true);

updateAccount = async (id, logs, lock) => {
  const limitDate = new Date();
  limitDate.setMinutes(limitDate.getMinutes() - process.env.USER_LOCKED_LENGTH);
  let failedLogin = 1;
  let i = 0;
  if (logs.length > 0) {
    while (i < logs.length && logs[i].time > limitDate && failedLogin < 3) {
      if (
        logs[i].value.includes('Successfully logged in.')
        || logs[i].value.includes('Successfully reset password - reset password through "Forgot Password"')
      ) {
        break;
      }

      if (logs[i].value.includes('Failed to logged in.')) {
        failedLogin += 1;
      }

      i += 1;
    }

    if (failedLogin >= 3) {
      // update the doc
      await User.findByIdAndUpdate(id,
        { $set: { locked: lock } },
        { new: true })
        .then(r => r);
      await updateLogs('Admin', id, 'authentication', 8);
      return true;
    }
  }
  return false;
};
