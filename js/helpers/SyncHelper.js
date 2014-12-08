var CategoryStore = require('../stores/CategoryStore');
var ProgressStore = require('../stores/ProgressStore');

SERVER = "http://localhost:3000"

var start = function() {
  if (SERVER === "") {

  } else {
    setInterval(function(){
      if (CategoryStore.getSyncCount() === 0) {
        CategoryStore.sync();
      }
      if (ProgressStore.getSyncCount() === 0) {
        ProgressStore.sync();
      }
    }, 2000);
  }
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