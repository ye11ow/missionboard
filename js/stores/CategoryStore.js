var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Storage = require('../helpers/Storage'),
    i18n = require("../helpers/I18n"),
    EventEmitter = require('events').EventEmitter,
    CategoryConstants = require('../constants/CategoryConstants'),
    CategoryActions = require('../actions/CategoryActions');

var utils = require('../helpers/Utils.js');

const CHANGE_EVENT = 'change';

var _categories = {},
    _current = CategoryConstants.CATEGORY_ALLID;

const CATEGORYALL = {
      id: CategoryConstants.CATEGORY_ALLID,
      title: i18n.getMessage("labelCategoryAll"),
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
    title,
    order,
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

function switchCategory(category) {
  if (category in _categories) {
    _current = category;
  } else {
    _current = CATEGORYALL.id;
  }
  
}

var CategoryStore = Object.assign({}, EventEmitter.prototype, {

  init() {
    var ids = [];
    ids.push(create(i18n.getMessage("sampleCategory1"), 1));
    ids.push(create(i18n.getMessage("sampleCategory2"), 2));
    ids.push(create(i18n.getMessage("sampleCategory3"), 3));

    this.persist();

    return ids;
  },

  loadCategories(categories) {
    _categories = categories;
  },

  getAll() {
    _categories[CATEGORYALL.id] = CATEGORYALL;

    return _categories;
  },

  getCurrentCategory() {
    return _current;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  persist() {
    Storage.set({'_categories': _categories}, function(){});
  },

  clear() {
    Storage.remove('_categories');
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

  return true;
});


module.exports = CategoryStore;