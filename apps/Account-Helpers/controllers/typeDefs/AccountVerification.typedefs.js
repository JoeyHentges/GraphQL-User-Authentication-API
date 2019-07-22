const { buildSchema } = require('graphql');

const defs = `
    scalar Date

    type AccountVerification {
        id: ID
        fulfilled: Boolean
        userId: String
        userFirstName: String
        userUsername: String
        expirationDate: Date
    }

    type Query {
        getAccountVerifications: [AccountVerification!]!
        getAccountVerificationById(id: ID!): AccountVerification
    }

    type Mutation {
        createAccountVerification(userId: String!, userFirstName: String, userUsername: String): AccountVerification
        updateFulfilled(id: ID!): AccountVerification
    }
`;

module.exports.AccountVerificationTypedefs = buildSchema(`${defs}`);
