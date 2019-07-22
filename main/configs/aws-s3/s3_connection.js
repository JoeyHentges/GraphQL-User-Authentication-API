const AWS = require('aws-sdk');
const { accessKeyId, secretAccessKey } = require('./s3_config');

module.exports.s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
});

module.exports.s3Config = {
  accessKeyId,
  secretAccessKey
};
