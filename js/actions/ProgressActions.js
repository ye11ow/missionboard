var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ProgressConstants = require('../constants/ProgressConstants');

var ProgressActions = {

  /**
   * @param  {string} title
   */
  create(title, current, total, category, type, description) {
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
  setEditing(progress) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_EDITING,
      progress
    });
  },

  update(id, title, current, total, category, type, description) {
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

  updateProgress(id, current) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_UPDATE_PROGRESS,
      id,
      current
    });
  },

  /**
   * @param  {string} id
   */
  destroy(id) {
    AppDispatcher.dispatch({
      actionType: ProgressConstants.PROGRESS_DESTROY,
      id
    });
  }
};

module.exports = ProgressActions;
