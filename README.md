# Node.js-Basic User Authentication API
An API that makes user authentication simple, and secure.
## Features

**Tools**
* [x] **[Node.JS](https://nodejs.org)** v10.x.x
* [x] **[Express](https://github.com/expressjs/express)**
* [x] [MongoDB](https://www.mongodb.com/) with [Mongoose](https://github.com/Automattic/mongoose)
* [x] **[GraphQL](http://graphql.org/)**
* [x] [Cluster](https://nodejs.org/api/cluster.html)
* [x] [AWS S3](https://aws.amazon.com/s3/)
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
|
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
|
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
|
|   +---configs.js
|   +---tools.js
|
+---main
|   +---aws-s3
|       +---s3_config.js
|       +---s3_connection.js
|
|   +---db
|       +---db_config.js
|       +---db_connection.js
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

### How to connect to the Database(s) and make a save.

View controllers folder for an example of Querying and Mutations.
