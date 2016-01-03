(function(){
  var isChromeApp = require("./IsChrome");
  var _MSG = null;
  
  if (!isChromeApp.isChromeApp) {
    _MSG = require("../../_locales/en/messages");
  }

  var getMessage = function(messageName) {
    if (isChromeApp.isChromeApp) {
      return chrome.i18n.getMessage.apply(chrome, Array.prototype.slice.call(arguments));
    } else {
      var msg = _MSG[messageName];
      if (msg) {
        return msg.message;
      } else {
        return messageName;
      }
    }
  };

  module.exports.getMessage = getMessage;
}())