var Backbone = require('backbone'),
    utils = require('../helpers/Utils.js');

var Progress = Backbone.Model.extend({
  defaults: {
    title: "",
    current: 0,
    total: 10,
    completed: false,
    category: "",
    type: "",
    description: "",
    createdAt: Date.now(),
  },

  destroy: function() {
    console.log("destroyed");
    return;
  },

  sync: function(method, model) {
    return;
  }
});

module.exports = Progress;
