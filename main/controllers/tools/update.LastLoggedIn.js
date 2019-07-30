const { User } = require('../../../apps/User/user.exports');

let updateUser;

module.exports.updateLastLogged = async (model, id) => updateUser(id);

updateUser = async (id) => {
  const newDate = new Date();
  let lastLogged = await User.findByIdAndUpdate(id,
    { $set: { dateLastLoggedIn: newDate } },
    { new: false })
    .then(result => result);

  if (lastLogged === null) {
    lastLogged = newDate;
  } else {
    lastLogged = lastLogged.dateLastLoggedIn;
  }
  return lastLogged;
};
