const { buildSchema } = require('graphql');

const defs = `
    scalar Date

    type PasswordReset {
        id: ID
        fulfilled: Boolean
        userId: String
        userFirstName: String
        userUsername: String
        expirationDate: Date
    }

    type Query {
        getPasswordResets: [PasswordReset!]!
        getPasswordResetById(id: ID!): PasswordReset
    }

    type Mutation {
        createPasswordReset(userId: String!, userFirstName: String, userUsername: String): PasswordReset!
        updateFulfilled(id: ID!): PasswordReset!
    }
`;

module.exports.PasswordResetTypedefs = buildSchema(`${defs}`);
