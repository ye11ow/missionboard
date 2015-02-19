var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    CategoryConstants = require('../constants/CategoryConstants'),
    CategoryActions = require('../actions/CategoryActions');

var utils = require('../helpers/Utils.js'),
    assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _categories = {},
    _current = CategoryConstants.CATEGORY_ALLID,
    categoryAll = {
      id: CategoryConstants.CATEGORY_ALLID,
      title: chrome.i18n.getMessage("labelCategoryAll"),
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

function updateTitle(id, title) {
  _categories[id].title = title;
}

function updateOrderby(id, by, type) {
  _categories[id].orderby = {
    by: by,
    type: type
  };
}

function updateOrder(id, targetId) {
  var category = _categories[id],
      targetCategory = _categories[targetId],
      originOrder = category.order;

  if (originOrder > targetCategory.order) {
    category.order = targetCategory.order + 1;
    for (var key in _categories) {
      if (_categories[key].order >= category.order && _categories[key].order < originOrder && key !== id) {
        _categories[key].order++;
      }
    }
  } else {
    category.order = targetCategory.order
    for (var key in _categories) {
      if (_categories[key].order <= category.order && _categories[key].order > originOrder && key !== id) {
        _categories[key].order--;
      }
    }
  }
}

function switchCategory(category) {
  _current = category;
}

/**
 * Delete a Category.
 * @param  {string} id
 */
function destroy(id) {
  delete _categories[id];
  if (id === _current) {
    _current = CategoryConstants.CATEGORY_ALLID;
  }
}

var CategoryStore = assign({}, EventEmitter.prototype, {

  init: function() {
    var ids = [];
    ids.push(create(chrome.i18n.getMessage("sampleCategory1"), 1));
    ids.push(create(chrome.i18n.getMessage("sampleCategory2"), 2));
    ids.push(create(chrome.i18n.getMessage("sampleCategory3"), 3));
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

  getCurrentCategory: function() {
    return _current;
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
    chrome.storage.sync.set({'_categories': _categories}, function(){
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    });
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

    case CategoryConstants.CATEGORY_SWITCH:
      switchCategory(action.id);
      break;

    case CategoryConstants.CATEGORY_TITLE_UPDATE:
      title = action.title.trim();
      if (title !== '') {
        updateTitle(action.id, title);
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