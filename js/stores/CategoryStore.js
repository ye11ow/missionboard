var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CategoryConstants = require('../constants/CategoryConstants');
var CategoryActions = require('../actions/CategoryActions');

var utils = require('../helpers/Utils.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _categories = {};

var categoryAll = {
  id: CategoryConstants.CATEGORY_ALLID,
  title: "All",
  order: 0,
  count: 0,
  system: true,
  orderby: {
    by: "title",
    type: "asc"
  }
};

/**
 * Create a Category.
 */
function create(title, order) {
  var category = {
    id: utils.UUID(),
    title: title,
    order: order,
    system: false,
    orderby: {
      by: "title",
      type: "asc"
    }
  };

  _categories[category.id] = category;

  return category.id;
}

function updateOrderby(id, by, type) {
  _categories[id].orderby = {
    by: by,
    type: type
  };
}

function updateOrder(id, targetId) {
  var category = _categories[id],
      targetCategory = _categories[targetId];

  var tmp = category.order;
  category.order = targetCategory.order;
  targetCategory.order = tmp;
}

/**
 * Delete a Category.
 * @param  {string} id
 */
function destroy(id) {
  delete _categories[id];
}

var CategoryStore = assign({}, EventEmitter.prototype, {

  init: function() {
    var ids = [];
    ids.push(create("Videos", 1));
    ids.push(create("Books",  2));
    ids.push(create("Others", 3));
    CategoryStore.persist();

    return ids;
  },

  loadCategories: function(categories) {
    _categories = categories;
  },

  getAll: function() {
    _categories[categoryAll.id] = categoryAll;

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
  },

  persist: function() {
    chrome.storage.sync.set({'_categories': _categories});
  },

  clear: function() {
    chrome.storage.sync.remove('_categories');
  }

});

AppDispatcher.register(function(action) {
  var title;

  switch(action.actionType) {
    case CategoryConstants.CATEGORY_CREATE:
      title = action.title.trim();
      if (title !== '') {
        action.id = create(title, action.order);
      }
      break;

    case CategoryConstants.CATEGORY_ORDERBY_UPDATE:
      updateOrderby(action.id, action.by, action.type);
      break;

    case CategoryConstants.CATEGORY_ORDER_UPDATE:
      updateOrder(action.id, action.targetId);
      break;

    case CategoryConstants.CATEGORY_DESTROY:
      destroy(action.id);
      break;

    default:
      return true;
  }

  CategoryStore.persist();
  CategoryStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = CategoryStore;