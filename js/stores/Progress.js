var Backbone = require('backbone'),
    utils = require('../helpers/Utils.js');

var Progress = Backbone.Model.extend({
  defaults: {
    id: utils.UUID(),
    title: "",
    current: 0,
    total: 10,
    completed: false,
    category: "",
    type: "",
    description: "",
    createdAt: Date.now(),
  },

  sync: function(method, model) {
    console.log(method, model.attributes);
  }
});

module.exports = Progress;
