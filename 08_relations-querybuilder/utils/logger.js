require('colors');

class Logger {
  log(msg) {
    console.log(new Date().toLocaleString(), msg.green);
  }

  warn(msg) {
    console.log(new Date().toLocaleString(), msg.yellow);
  }

  error(msg) {
    console.log(new Date().toLocaleString(), msg.red);
  }
}

module.exports = new Logger();
// or use winston logger
