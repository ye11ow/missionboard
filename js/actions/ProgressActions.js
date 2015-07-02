var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ProgressConstants = require('../constants/ProgressConstants');

var ProgressActions = {

  /**
   * @param  {string} title
   */
  create: function(title, current, total, category, type, description) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_CREATE,
      title,
      current,
      total,
      category,
      type,
      description
    });
  },

  /**
   * @param  {Progress} progress
   */
  setEditing: function(progress) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_EDITING,
      progress
    });
  },

  update: function(id, title, current, total, category, type, description) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_UPDATE,
      id,
      title,
      current,
      total,
      category,
      type,
      description
    });
  },

  updateProgress: function(id, current) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_UPDATE_PROGRESS,
      id,
      current
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_DESTROY,
      id
    });
  }
};

module.exports = ProgressActions;
