const { PasswordReset } = require('../../models/PasswordReset');

const getPasswordResets = () => PasswordReset.find();

const getPasswordResetById = id => PasswordReset.findById(id);

const createPasswordReset = async (userId, userFirstName, userUsername) => {
  const expirationDate = new Date();
  const fulfilled = false;
  expirationDate.setMinutes(
    expirationDate.getMinutes() + process.env.PASSWORD_RESET_DURATION
  );
  const passwordReset = new PasswordReset({
    fulfilled, userId, userFirstName, userUsername, expirationDate
  });
  await passwordReset.save();
  return passwordReset;
};

const updateFulfilled = async (id) => {
  const val = await PasswordReset.findByIdAndUpdate(id,
    { $set: { fulfilled: true } },
    { new: true })
    .then(result => result);
  return val;
};

// Functions condenced to be exported
const PasswordResetResolvers = {
  Query: {
    getPasswordResets: () => getPasswordResets(),
    getPasswordResetById: ({ id }) => getPasswordResetById(id)
  },
  Mutation: {
    createPasswordReset: async ({
      userId, userFirstName, userUsername
    }) => createPasswordReset(userId, userFirstName, userUsername),
    updateFulfilled: async ({
      id
    }) => updateFulfilled(id)
  }
};

module.exports.PasswordResetResolvers = PasswordResetResolvers;
