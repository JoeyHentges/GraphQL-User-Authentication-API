const bcrypt = require('bcrypt');
const { User } = require('../../models/User');

const getUsers = () => User.find();

const getUserById = id => User.findById(id);

const getUserByUsername = username => User.findOne({ username: new RegExp(`^${username}$`, 'i') });

const getUserByEmail = email => User.findOne({ email: new RegExp(`^${email}$`, 'i') });

const createUser = async (
  firstName, lastName, email, username, password,
  securityQuestionOne, securityQuestionOneAnswer,
  securityQuestionTwo, securityQuestionTwoAnswer,
  securityQuestionThree, securityQuestionThreeAnswer
) => {
  // Hash the new password
  const hashedPassword = await bcrypt
    .hash(password, 10)
    .then(hash => hash);
  const date = new Date();
  const user = new User({
    locked: false,
    disabled: false,
    accountVerified: false,
    email,
    username,
    firstName,
    lastName,
    password: hashedPassword,
    dateCreated: date,
    dateModified: date,
    securityQuestions: {
      questionOne: {
        question: securityQuestionOne,
        answer: securityQuestionOneAnswer,
      },
      questionTwo: {
        question: securityQuestionTwo,
        answer: securityQuestionTwoAnswer,
      },
      questionThree: {
        question: securityQuestionThree,
        answer: securityQuestionThreeAnswer,
      },
    },
    profilePage: {
      image: '',
      phone: '',
      biography: '',
      linkedin: '',
      facebook: '',
      twitter: '',
      instagram: '',
      github: '',
      youtube: '',
      stackoverflow: ''
    }
  });
  await user.save();
  return user;
};

const deleteUser = async id => User.findByIdAndDelete(id).then( result => result);

const updateUser = async (id, updateVariable, updateValue) => {
  if (updateValue === '~DATETIME~') {
    const val = await User.findByIdAndUpdate(id,
      { $set: { [updateVariable]: new Date() } },
      { new: false })
      .then(result => result);
    return val;
  }
  const val = await User.findByIdAndUpdate(id,
    { $set: { [updateVariable]: updateValue } },
    { new: true })
    .then(result => result);
  return val;
};

// Functions condenced to be exported
const userResolvers = {
  Query: {
    getUsers: () => getUsers(),
    getUserById: ({ id }) => getUserById(id),
    getUserByUsername: ({ username }) => getUserByUsername(username),
    getUserByEmail: ({ email }) => getUserByEmail(email)
  },
  Mutation: {
    createUser: async ({
      firstName, lastName, email, username, password,
      securityQuestionOne, securityQuestionOneAnswer,
      securityQuestionTwo, securityQuestionTwoAnswer,
      securityQuestionThree, securityQuestionThreeAnswer
    }) => createUser(
      firstName, lastName, email, username, password,
      securityQuestionOne, securityQuestionOneAnswer,
      securityQuestionTwo, securityQuestionTwoAnswer,
      securityQuestionThree, securityQuestionThreeAnswer
    ),
    deleteUser: async ({ id }) => deleteUser(id),
    updateUser: async ({
      id, updateVariable, updateValue
    }) => updateUser(id, updateVariable, updateValue),
  }
};

module.exports.userResolvers = userResolvers;
