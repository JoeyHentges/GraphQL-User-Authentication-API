const chalk = require('chalk');
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
require('dotenv').config();

// Code to run if we're in the master process
if (cluster.isMaster) {
  // Create a worker for each CPU
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  // eslint-disable-next-line global-require
  require('./server');
  console.log(`Started server on => ${chalk.blue(`http://localhost:${process.env.PORT}`)} for Process Id ${chalk.green(process.pid)}`);
}
