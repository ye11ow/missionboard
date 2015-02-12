var AppDispatcher = require('../dispatcher/AppDispatcher'),
    CategoryConstants = require('../constants/CategoryConstants');

var CategoryActions = {

  /**
   * @param  {string} title
   */
  create: function(title, order) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_CREATE,
      title: title,
      order: order
    });
  },

  switch: function(category) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_SWITCH,
      id: category
    });
  },

  updateTitle: function(id, title) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_TITLE_UPDATE,
      id: id,
      title: title
    });
  },

  updateOrderby: function(id, by, type) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_ORDERBY_UPDATE,
      id: id,
      by: by,
      type: type
    });
  },

  updateOrder: function(id, targetId) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_ORDER_UPDATE,
      id: id,
      targetId: targetId
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_DESTROY,
      id: id
    });
  }

};

module.exports = CategoryActions;
