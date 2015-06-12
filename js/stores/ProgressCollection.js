var Backbone = require('backbone'),
    Progress =require('./Progress');

var ProgressCollection = Backbone.Collection.extend({
  model: Progress,

  sync: function(method, collection) {
    var attrModels = this.models.map(function(model) {
      return model.attributes;
    });
    chrome.storage.sync.set({'_progresses': attrModels}, function() {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    });
  }
});

var progressCollection = new ProgressCollection;

chrome.storage.sync.get("_progresses", function(item) {
  var i = 0;
  for (i = 0;i < item._progresses.length; i++) {
    var attr = item._progresses[i];
    progressCollection.create(attr);
  }
  progressCollection.on('add remove change', function() {
    progressCollection.sync();
  }.bind(progressCollection));
});

module.exports = progressCollection;