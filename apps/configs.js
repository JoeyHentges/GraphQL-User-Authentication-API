const { dbs } = require('../main/configs/db/db_connection');
const { s3 } = require('../main/configs/aws-s3/s3_connection');

module.exports = {
  dbs,
  s3
};
