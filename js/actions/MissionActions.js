var AppDispatcher = require('../dispatcher/AppDispatcher'),
    MissionConstants = require('../constants/MissionConstants');

var MissionActions = {

  /**
   * @param  {string} title
   */
  create(title, current, total, category, type, description) {
    AppDispatcher.dispatch({
      actionType: MissionConstants.MISSION_CREATE,
      title,
      current,
      total,
      category,
      type,
      description
    });
  },

  /**
   * @param  {Mission} mission
   */
  setEditing(mission) {
    AppDispatcher.dispatch({
      actionType: MissionConstants.MISSION_EDITING,
      mission
    });
  },

  update(id, title, current, total, category, type, description) {
    AppDispatcher.dispatch({
      actionType: MissionConstants.MISSION_UPDATE,
      id,
      title,
      current,
      total,
      category,
      type,
      description
    });
  },

  updateMission(id, current) {
    AppDispatcher.dispatch({
      actionType: MissionConstants.MISSION_UPDATE_MISSION,
      id,
      current
    });
  },

  /**
   * @param  {string} id
   */
  destroy(id) {
    AppDispatcher.dispatch({
      actionType: MissionConstants.MISSION_DESTROY,
      id
    });
  },

  /**
   * @param  {string} categoryId
   */
  destroyMissionByCategory(categoryId) {
    AppDispatcher.dispatch({
      actionType: MissionConstants.MISSION_DESTROY_BY_CATEGORY,
      categoryId
    });
  }

};

module.exports = MissionActions;
