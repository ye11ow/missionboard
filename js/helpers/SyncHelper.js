var CategoryStore = require('../stores/CategoryStore');

LOCAL_MODE = false;
SERVER = "http://localhost:3000"

var start = function() {
  CategoryStore.sync();
}

module.exports = {
  start: start
};


//setInterval(syncDaemon, 10000);