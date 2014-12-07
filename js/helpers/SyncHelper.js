var CategoryStore = require('../stores/CategoryStore');
var ProgressStore = require('../stores/ProgressStore');


LOCAL_MODE = false;
SERVER = "http://localhost:3000"

var start = function() {
  CategoryStore.sync();
  ProgressStore.sync();
}

var clear = function() {
  CategoryStore.clear();
  ProgressStore.clear();
}

module.exports = {
  start: start,
  clear: clear
};


//setInterval(syncDaemon, 10000);