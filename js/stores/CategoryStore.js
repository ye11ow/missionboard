var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CategoryConstants = require('../constants/CategoryConstants');
var utils = require('../helpers/Utils.js');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _categories = {};
var _syncList = {};
var _syncCount = 0;
var _length = 0;


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
  _length++;

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
  _length--;
}

var CategoryStore = merge(EventEmitter.prototype, {

  setCategories: function(categories) {
    _categories = categories;
    if (localStorage["categories"] && localStorage["categories.sync"]) {
      var localCategories = JSON.parse(localStorage["categories"]);
      _syncList = JSON.parse(localStorage["categories.sync"]);
      for (var id in _syncList) {
        _categories[id] = localCategories[id];
      }
    }
  },

  getAll: function() {
    return _categories;
  },

  getSyncs: function() {
    return _syncList;
  },

  getSyncCount: function() {
    return _syncCount;
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

  sync: function() {
    for (var id in _syncList) {
      var actionType = _syncList[id].actionType;
      var category = _categories[id];
      _syncCount++;

      switch(actionType) {
        case CategoryConstants.CATEGORY_CREATE:
          $.post( SERVER + "/categories/", category, function(data) {
            delete _syncList[id];
            _syncCount--;
            console.log(data);
            CategoryStore.emitChange();
          });
          break;

        case CategoryConstants.CATEGORY_ORDERBY_UPDATE:
        case CategoryConstants.CATEGORY_ORDER_UPDATE:
          $.ajax({
            type: "PUT",
            url: SERVER + "/categories/" + id,
            data: category
          }).done(function( data ) {
            delete _syncList[id];
            _syncCount--;
            console.log(data);
            CategoryStore.emitChange();
          });
          break;

        case CategoryConstants.CATEGORY_DESTROY:
          $.ajax({
            type: "DELETE",
            url: SERVER + "/categories/" + id
          }).done(function( data ) {
            delete _syncList[id];
            _syncCount--;
            console.log(data);
            CategoryStore.emitChange();
          });
          break;

        default:
          return true;
      }
    }
  },

  persist: function() {
    localStorage["categories"] = JSON.stringify(_categories);
    localStorage["categories.sync"] = JSON.stringify(_syncList);
  },

  clear: function() {
    localStorage["categories"] = "";
    localStorage["categories.sync"] = "";
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;
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
      // too hacky here.
      if (_syncList[action.targetId]) {
        if (_syncList[action.targetId].actionType === CategoryConstants.CATEGORY_CREATE) {
          if (action.actionType === CategoryConstants.CATEGORY_DESTROY) {
            delete _syncList[action.targetId];
          } else {
            return;
          }
        }
      } else {
        _syncList[action.targetId] = {
          actionType: action.actionType
        }
      }

      break;

    case CategoryConstants.CATEGORY_DESTROY:
      destroy(action.id);
      break;

    default:
      return true;
  }

  if (_syncList[action.id]) {
    if (_syncList[action.id].actionType === CategoryConstants.CATEGORY_CREATE) {
      if (action.actionType === CategoryConstants.CATEGORY_DESTROY) {
        delete _syncList[action.id];
      } else {
        return;
      }
    }
  } else {
    _syncList[action.id] = {
      actionType: action.actionType
    }
  }

  CategoryStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = CategoryStore;