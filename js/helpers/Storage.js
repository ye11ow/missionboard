(function(){
  var set = function(items, callback) {
    if (chrome && chrome.storage) {
      chrome.storage.sync.set.apply(chrome.storage.sync, Array.prototype.slice.call(arguments));
    } else if (localStorage) {
      for (var item in items) {
        localStorage.setItem(item, JSON.stringify(items[item]));
      }
      if (callback) {
        callback();
      }
    }
  };

  var get = function(items, callback) {
    if (chrome && chrome.storage) {
      chrome.storage.sync.get.apply(chrome.storage.sync, Array.prototype.slice.call(arguments));
    } else if (localStorage) {
      var result = {};
      for (var item in items) {
        var data = localStorage.getItem(items[item]);
        if (data) {
          result[items[item]] = JSON.parse(data);
        }
      }
      callback(result);
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
      localStorage.clear();
      callback();
    }
  };

  module.exports.set = set;
  module.exports.get = get;
  module.exports.remove = remove;
  module.exports.clear = clear;
}())