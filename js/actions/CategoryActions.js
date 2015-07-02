var AppDispatcher = require('../dispatcher/AppDispatcher'),
    CategoryConstants = require('../constants/CategoryConstants');

var CategoryActions = {

  /**
   * @param  {string} title
   */
  create: function(title, order) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_CREATE,
      title,
      order
    });
  },

  switch: function(id) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_SWITCH,
      id: id
    });
  },

  updateTitle: function(id, title) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_TITLE_UPDATE,
      id,
      title
    });
  },

  updateOrderby: function(id, by, type) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_ORDERBY_UPDATE,
      id,
      by,
      type
    });
  },

  updateOrder: function(id, targetId) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_ORDER_UPDATE,
      id,
      targetId
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_DESTROY,
      id
    });
  }

};

module.exports = CategoryActions;
