var AppDispatcher = require('../dispatcher/AppDispatcher');
var CategoryConstants = require('../constants/CategoryConstants');

var CategoryActions = {

  /**
   * @param  {string} title
   */
  create: function(title) {
    AppDispatcher.handleViewAction({
      actionType: CategoryConstants.CATEGORY_CREATE,
      title: title
    });
  },

  updateOrderby: function(id, by, type) {
    AppDispatcher.handleViewAction({
      actionType: CategoryConstants.CATEGORY_ORDERBY_UPDATE,
      id: id,
      by: by,
      type: type
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: CategoryConstants.CATEGORY_DESTROY,
      id: id
    });
  }

};

module.exports = CategoryActions;
