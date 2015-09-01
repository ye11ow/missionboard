var AppDispatcher = require('../dispatcher/AppDispatcher'),
    CategoryConstants = require('../constants/CategoryConstants');

var CategoryActions = {

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

  updateOrder(id, targetId) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_ORDER_UPDATE,
      id,
      targetId
    });
  },

  destroy(id) {
    AppDispatcher.dispatch({
      actionType: CategoryConstants.CATEGORY_DESTROY,
      id
    });
  }

};

module.exports = CategoryActions;
