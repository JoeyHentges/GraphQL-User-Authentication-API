const { AccountVerification } = require('../../models/AccountVerification');

const getAccountVerifications = () => AccountVerification.find();

const getAccountVerificationById = id => AccountVerification.findById(id);

const createAccountVerification = async (userId, userFirstName, userUsername) => {
  console.log('temp');
  const expirationDate = new Date();
  const fulfilled = false;
  expirationDate.setMinutes(
    expirationDate.getMinutes() + process.env.ACCOUNT_VERIFCATION_DURATION
  );
  const accountVerification = new AccountVerification({
    fulfilled, userId, userFirstName, userUsername, expirationDate
  });
  await accountVerification.save();
  return accountVerification;
};

const updateFulfilled = async (id) => {
  const val = await AccountVerification.findByIdAndUpdate(id,
    { $set: { fulfilled: true } },
    { new: true })
    .then(result => result);
  return val;
};

// Functions condenced to be exported
const AccountVerificationResolvers = {
  Query: {
    getAccountVerifications: () => getAccountVerifications(),
    getAccountVerificationById: ({ id }) => getAccountVerificationById(id)
  },
  Mutation: {
    createAccountVerification: async ({
      userId, userFirstName, userUsername
    }) => createAccountVerification(userId, userFirstName, userUsername),
    updateFulfilled: async ({
      id
    }) => updateFulfilled(id)
  }
};

module.exports.AccountVerificationResolvers = AccountVerificationResolvers;
