const express = require('express');

const router = express.Router();

router.use('/', require('./initialize_apps').router);

module.exports.router = router;
