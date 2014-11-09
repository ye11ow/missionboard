var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CategoryConstants = require('../constants/CategoryConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _categories = {};
var _length = 0;

function create(title, order) {
  var category = {
    title: title,
    system: false,
    order: order,
    orderby: null
  };
  $.post( SERVER + "/categories/", category, function(data) {
    if (data && typeof data === "string") {
      data = JSON.parse(data);
    }
    var id = data["_id"]["$oid"]
    if (id && id.length > 0) {
      category["id"] = data["_id"]["$oid"];
      category["orderby"] = data["orderby"];
      _categories[id] = category;
      _length++;

      CategoryStore.emitChange();
    }
  });
}

function updateOrderby(id, by, type) {
  var orderby = {
    by: by,
    type:type
  }
  $.ajax({
    type: "PUT",
    url: SERVER + "/categories/" + id + "/orderby",
    data: orderby
  }).done(function( data ) {
    _categories[id].orderby = orderby;
    console.log(data);

    CategoryStore.emitChange();
  });
}

function updateOrder(id, targetId) {
  var category = _categories[id],
      targetCategory = _categories[targetId];

  var tmp = category.order;
  category.order = targetCategory.order;
  targetCategory.order = tmp;

  var order = {
    order: category.order
  };

  $.ajax({
    type: "PUT",
    url: SERVER + "/categories/" + id + "/order",
    data: order
  }).done(function( data ) {
    console.log(data);
  });

  order = {
    order: targetCategory.order
  };

  $.ajax({
    type: "PUT",
    url: SERVER + "/categories/" + targetId + "/order",
    data: order
  }).done(function( data ) {
    console.log(data);
  });

  CategoryStore.emitChange();
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
        create(title, action.order);
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

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = CategoryStore;