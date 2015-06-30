(function(){

  var reload = function() {
    if (chrome && chrome.i18n) {
      return chrome.runtime.reload();
    } else {
      return window.location.reload();
    }
  };

  module.exports.reload = reload;

}())