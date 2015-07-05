var AppDispatcher = require('../dispatcher/AppDispatcher'),
    CategoryConstants = require('../constants/CategoryConstants');

var CategoryActions = {

  /**
   * @param  {string} title
   */
  create(title, order) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_CREATE,
      title,
      order
    });
  },

  switch(id) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_SWITCH,
      id: id
    });
  },

  updateTitle(id, title) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_TITLE_UPDATE,
      id,
      title
    });
  },

  updateOrderby(id, by, type) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_ORDERBY_UPDATE,
      id,
      by,
      type
    });
  },

  updateOrder(id, targetId) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_ORDER_UPDATE,
      id,
      targetId
    });
  },

  /**
   * @param  {string} id
   */
  destroy(id) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_DESTROY,
      id
    });
  }

};

module.exports = CategoryActions;
