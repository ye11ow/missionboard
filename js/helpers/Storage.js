(function(){
  var set = function(item, callback) {
    if (chrome && chrome.storage) {
      chrome.storage.sync.set.apply(chrome.storage.sync, Array.prototype.slice.call(arguments));
    } else if (localStorage) {
      localStorage.setItem(JSON.stringify(item));
      if (callback) {
        callback();
      }
    }
  };

  var get = function(name, callback) {
    if (chrome && chrome.storage) {
      chrome.storage.sync.get.apply(chrome.storage.sync, Array.prototype.slice.call(arguments));
    } else if (localStorage) {
      var val = localStorage.getItem(name);
      if (val) {
        callback(JSON.parse(val));
      }
    }
  };

  var remove = function(name) {
    if (chrome && chrome.storage) {
      chrome.storage.sync.remove.apply(chrome.storage.sync, Array.prototype.slice.call(arguments));
    } else if (localStorage) {
      localStorage.removeItem(name);
    }
  };

  var clear = function(callback) {
    if (chrome && chrome.storage) {
      chrome.storage.sync.clear.apply(chrome.storage.sync, Array.prototype.slice.call(arguments));
    } else if (localStorage) {
      localStorage = "";
      callback();
    }
  };

  module.exports.set = set;
  module.exports.get = get;
  module.exports.remove = remove;
  module.exports.clear = clear;
}())