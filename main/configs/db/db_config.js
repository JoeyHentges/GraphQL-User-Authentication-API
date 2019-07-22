require('dotenv').config();

module.exports.dbs = {
  db1: {
    secret: process.env.MONGO_DB_1_SECRET,
    database: process.env.MONGO_DB_1_URL
  },
  db2: {
    secret: process.env.MONGO_DB_2_SECRET,
    database: process.env.MONGO_DB_2_URL
  }
};
