(function(){
  var isChromeApp = false;
  if (typeof chrome !== "undefined" && typeof chrome.runtime === "function" && typeof chrome.i18n === "function") {
    isChromeApp = true;
  }

  module.exports.isChromeApp = isChromeApp;
}())