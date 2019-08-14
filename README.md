# Node.js-Basic User Authentication API
An API that makes user authentication simple.

Note: The API does not handle sessions, but does keep track of the users last time signed in.

## Features
* [x] User Sign-Up
* [x] User Sign-In
* [x] User Deletion
* [x] User Update
* [x] User Get
* [x] Account Verification
* [x] Password Reseting

**Tools**
* [x] **[Node.JS](https://nodejs.org)** v10.x.x
* [x] **[Express](https://github.com/expressjs/express)**
* [x] [MongoDB](https://www.mongodb.com/) with [Mongoose](https://github.com/Automattic/mongoose)
* [x] **[GraphQL](http://graphql.org/)**
* [x] [Cluster](https://nodejs.org/api/cluster.html)
* [x] [Nodemailer](https://github.com/nodemailer/nodemailer)

**Debugging Tools**
* [x] [ESLint](https://eslint.org/) v5.x.x

## Usage

Install dependencies
```
$ npm install
```
or
```
yarn
```

For development
```bash
$ npm start
```

Run ESLint to check for ES6
```bash
$ npm run lint
```

Run ESLint to fix all fixable errors
```bash
$ npm run lint-fix
```

For production
```bash
$ npm run cluster
```

## Directory structure
```txt
+---apps
|   +---_
|       +---app_list.js
|       +---apps.js
|       +---initialize_apps.js
|   +---Account-Helpers
|       +---controllers
|       |   +---resolvers
|       |   +---typeDefs
|       +---models
|       |   +---AccountVerification.js
|       |   +---PasswordReset.js
|       +---routes
|       |   +---Account-Verification.js
|       |   +---Lock-Account.js
|       |   +---Password-Reset.js
|       |   +---routes.js
|       |   +---Update-Last-Logged-In.js
|       |   +---Update-Logs.js
|       +---Account-Helpers-exports.js
|       +---app_main.js
|   +---User
|       +---controllers
|       |   +---resolvers
|       |   +---typeDefs
|       +---models
|       |   +---User.js
|       +---routes
|       |   +---Create-User.js
|       |   +---Delete-User.js
|       |   +---Get-User.js
|       |   +---routes.js
|       |   +---Update-User.js
|       |   +---User-Sign-In.js
|       +---app_main.js
|       +---User-exports.js=
|   +---configs.js
|   +---tools.js
|
+---main
|   +---config
|       +---db
|           +---db_config.js
|           +---db_connection.js
|
+---controllers
|   +---api-tools
|   +---tools
|
+---routes
|   +---routes.js
|
+---views
|   +---email.templates
|       +---passwordReset.email.js
|       +---verify.email.js
|
+---.env.example
+---.eslintignore
+---.eslint.js
+---.gitignore
+---app.js
+---cluster.js
+---package-lock.json
+---package.json
+---README.md
+---server.js
+---yarn.lock
```

### How to Use

Out of the box, the API requires the following to create a new user:
```txt
+---firstName
+---lastName
+---email
+---username
+---password
+---securityQuestionOne
+---securityQuestionOneAnswer
+---securityQuestionTwo
+---securityQuestionTwoAnswer
+---securityQuestionThree
+---securityQuestionThreeAnswer
```


Examples of the API Using [Superagent](https://www.npmjs.com/package/superagent):

#### User Sign Up:
```txt
const result = await superagent.post(`${process.env.API_URL}/user/create`)
    .send({
      key: process.env.API_KEY,
      firstName,
      lastName,
      email,
      username,
      password,
      securityQuestionOne,
      securityQuestionOneAnswer,
      securityQuestionTwo,
      securityQuestionTwoAnswer,
      securityQuestionThree,
      securityQuestionThreeAnswer
    }).then(response => response.body);
```

#### User Sign In:
```txt
const result = await superagent.post(`${process.env.API_URL}/user/sign-in`)
    .send({
      key: process.env.API_KEY,
      username,
      password,
      values: 'id'
    }).then(response => response.body);
```

#### Get User:
```txt
const result = await superagent.get(`${process.env.API_URL}/user/username`)
    .send({
      key: process.env.API_KEY,
      username,
      values: 'id'
    }).then(response => response.body);
```
