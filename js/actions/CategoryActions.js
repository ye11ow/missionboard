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
