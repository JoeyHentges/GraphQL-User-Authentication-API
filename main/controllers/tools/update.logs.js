const { getLogMessage } = require('./logMessages');
const { User } = require('../../../apps/User/user.exports');

let updateLogs;
let updateUser;

module.exports.updateLogs = async (
  id, type, messageNumber, logValue
) => updateLogs(id, type, messageNumber, logValue);

updateLogs = (id, type, messageNumber, logValue) => {
  let logVal = '';
  if (logValue !== undefined) {
    logVal = logValue;
  }
  return updateUser(id, type, messageNumber, logVal);
};

updateUser = async (id, type, messageNumber, logValue) => {
  const newDate = new Date();
  const date = newDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
  });
  const val = {
    time: newDate,
    value: `${date} | ${getLogMessage[type.toLowerCase()][messageNumber]}${logValue}`
  };
  const result = await User.findByIdAndUpdate(id,
    { $push: { logs: { $each: [val], $sort: -1 } } },
    { new: true })
    .then(r => r);
  return result;
};
