var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CategoryConstants = require('../constants/CategoryConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _categories = {};
var _length = 0;

function create(title) {
  var category = {
    title: title
  };
  $.post( SERVER + "/categories/", category, function(data) {
    if (data && typeof data === "string") {
      data = JSON.parse(data);
    }
    var id = data["_id"]["$oid"]
    if (id && id.length > 0) {
      category["id"] = data["_id"]["$oid"];
      _categories[id] = category;
      _length++;

      CategoryStore.emitChange();
    }
  });
}

function destroy(id) {
  $.ajax({
    type: "DELETE",
    url: SERVER + "/categories/" + id
  }).done(function( data ) {
    delete _categories[id];
    _length--;

    CategoryStore.emitChange();
  });
}

var CategoryStore = merge(EventEmitter.prototype, {

  setCategories: function(categories) {
    _categories = categories;
  },

  getAll: function() {
    return _categories;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  var title;

  switch(action.actionType) {
    case CategoryConstants.CATEGORY_CREATE:
      title = action.title.trim();
      if (title !== '') {
        create(title);
      }
      break;

    case CategoryConstants.CATEGORY_DESTROY:
      destroy(action.id);
      break;

    default:
      return true;
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = CategoryStore;