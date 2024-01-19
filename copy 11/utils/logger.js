require('colors');

class Logger {
  log(msg) {
    console.log(new Date().toLocaleString(), msg.green);
  }

  warn(msg) {
    console.log(new Date().toLocaleString(), msg.yellow);
  }

  err(msg) {
    console.log(new Date().toLocaleString(), msg.red);
  }
}

module.exports = new Logger();
