var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var _categories = {};
var _length = 0;


var CategoryStore = merge(EventEmitter.prototype, {

  setCategories: function(categories) {
    _categories = categories;
  },

  getAll: function() {
    return _categories;
  },
});


module.exports = CategoryStore;