(function(){
  var isChromeApp = require("./IsChrome");

  var reload = function() {
    if (isChromeApp.isChromeApp) {
      return chrome.runtime.reload();
    } else {
      return window.location.reload();
    }
  };

  module.exports.reload = reload;
}())