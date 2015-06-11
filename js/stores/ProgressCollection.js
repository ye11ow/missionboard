var Backbone = require('backbone'),
    Progress =require('./Progress');

var ProgressCollection = Backbone.Collection.extend({
  model: Progress,

  sync: function(method, collection) {
    console.log(method, collection)
  }
});

var progressCollection = new ProgressCollection;

progressCollection.create({
  title: "hello world1"
});

module.exports = progressCollection;