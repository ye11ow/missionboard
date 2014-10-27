var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProgressConstants = require('../constants/ProgressConstants');

var ProgressActions = {

  /**
   * @param  {string} title
   */
  create: function(title, current, total, category, type, description) {
    AppDispatcher.handleViewAction({
      actionType: ProgressConstants.PROGRESS_CREATE,
      title: title,
      current: current,
      total: total,
      category: category,
      type: type,
      description: description
    });
  },

  update: function(id, title, current, total, category, type, description) {
    AppDispatcher.handleViewAction({
      actionType: ProgressConstants.PROGRESS_UPDATE,
      id: id,
      title: title,
      current: current,
      total: total,
      category: category,
      type: type,
      description: description
    });
  },

  doit: function(id, current) {
    AppDispatcher.handleViewAction({
      actionType: ProgressConstants.PROGRESS_DOIT,
      id: id,
      current: current
    });
  },

  finish: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ProgressConstants.PROGRESS_FINISH,
      id: id
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ProgressConstants.PROGRESS_DESTROY,
      id: id
    });
  },

};

module.exports = ProgressActions;
