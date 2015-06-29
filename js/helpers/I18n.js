(function(){

  var getMessage = function(messageName) {
    if (chrome && chrome.i18n) {
      return chrome.i18n.getMessage.apply(chrome, Array.prototype.slice.call(arguments));
    } else {
      return messageName;
    }
  };

  module.exports.getMessage = getMessage;

}())