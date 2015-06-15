var Backbone = require('backbone'),
    CategoryConstants = require('../constants/CategoryConstants'),
    Progress =require('./Progress');

var ProgressCollection = Backbone.Collection.extend({
  model: Progress,

  init: function(ids) {
    this.models = [
      new Progress({
        title: chrome.i18n.getMessage("sampleAnime1Title"), 
        current: 3, 
        total: 12,
        completed: false,
        category: ids[0],
        description: chrome.i18n.getMessage("sampleAnime1Desc")
      }),
      new Progress({
        title: chrome.i18n.getMessage("sampleAnime2Title"), 
        current: 25, 
        total: 25,
        completed: true,
        category: ids[0],
        description: chrome.i18n.getMessage("sampleAnime2Desc")
      }),
      new Progress({
        title: chrome.i18n.getMessage("sampleBook1Title"), 
        current: 350, 
        total: 600,
        completed: false,
        category: ids[1],
        description: chrome.i18n.getMessage("sampleBook1Desc")
      }),
      new Progress({
        title: chrome.i18n.getMessage("sampleBook2Title"), 
        current: 300, 
        total: 500,
        completed: false,
        category: ids[1],
        description: chrome.i18n.getMessage("sampleBook2Desc")
      }),
      new Progress({
        title: chrome.i18n.getMessage("sampleOther1Title"), 
        current: 1, 
        total: 10,
        completed: false,
        category: ids[2],
        description: chrome.i18n.getMessage("sampleOther1Desc")
      })
    ];

    this.sync();
  },

  loadProgresses: function(progresses) {
    console.log("loading progresses from storage");
    var models = [];

    if (progresses) {
      for (var i = 0;i < progresses.length; i++) {
        models.push(new Progress(progresses[i]));
      }

      this.models = models;
    }
  },

  sync: function(method, collection) {
    var attrModels = this.models.map(function(model) {
      return model.attributes;
    });
    chrome.storage.sync.set({'_progresses': attrModels}, function() {
      console.log("saving progresses");
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    });
  },

  countByCategory: function(category) {
    if (category === CategoryConstants.CATEGORY_ALLID) {
      return this.where({completed: false}).length;
    } else {
      return this.where({
        category: category,
        completed: false
      }).length;
    }
  }
});

var progressCollection = new ProgressCollection;

progressCollection.on('add remove change', function() {
  progressCollection.sync();
}.bind(progressCollection));

module.exports = new ProgressCollection;