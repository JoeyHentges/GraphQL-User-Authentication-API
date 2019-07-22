const express = require('express');

// Bring in routes
const UpdateLastLoggedIn = require('./Update-Last-Logged-In');
const UpdateLogs = require('./Update-Logs');
const LockAccount = require('./Lock-Account');
const AccountVerification = require('./Account-Verification');
const PasswordReset = require('./Password-Reset');

const router = express.Router();

// Add routes to the router
router.use('/', UpdateLastLoggedIn.routes);
router.use('/', UpdateLogs.routes);
router.use('/', LockAccount.routes);
router.use('/', AccountVerification.routes);
router.use('/', PasswordReset.routes);

module.exports.routes = router;
