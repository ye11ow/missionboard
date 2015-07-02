(function(){
  var isChromeApp = false;
  if (typeof chrome !== "undefined" && typeof chrome.runtime === "object" && typeof chrome.i18n === "object") {
    isChromeApp = true;
  }

  module.exports.isChromeApp = isChromeApp;
}())