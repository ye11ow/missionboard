var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    Storage = require('../helpers/Storage'),
    i18n = require("../helpers/I18n"),
    MissionConstants = require('../constants/MissionConstants');

var utils = require('../helpers/Utils.js');

const CHANGE_EVENT = 'change';

var _missions = {},
    _editing = null;

/**
 * Create a Mission.
 */
function create(title, current, total, category, type, description) {
  var mission = {
    id: utils.UUID(),
    title,
    current,
    total,
    completed: current >= total ? true : false,
    category,
    type,
    description,
    createdAt: Date.now(),
  };
     
  _missions[mission.id] = mission;

  return mission.id;
}

function setEditing(mission) {
  _editing = mission;
}

/**
 * Delete a Mission.
 * @param  {string} id
 */
function destroy(id) {
  delete _missions[id];
}

function destoryByCategory(categoryId) {
  for (var key in _missions) {
    if (_missions[key].category === categoryId) {
      destroy(key);
    }
  }
}

function update(id, title, current, total, category, type, description) {
  var mission = _missions[id];
  if (mission) {
    if (title && title.length > 0) {
      mission.title = title;
    }
    if (typeof current === "number" && current >= 0) {
      mission.current = current;
    }
    if (typeof total === "number" && total >= 0) {
      mission.total = total;
    }
    if (category && category.length > 0) {
      mission.category = category;
    }
    if (type && type.length > 0) {
      mission.type = type;
    }
    
    mission.description = description;
    mission.completed = (mission.current >= mission.total);
  }
}

function updateMission(id, current) {
  var mission = _missions[id];
  if (mission) {
    if (current && typeof current === "number") {
      if (current === -1) {
        current = mission.total;
      }
      mission.current = current;
    }
    mission.completed = (mission.current >= mission.total);
  }
}

var MissionStore = Object.assign({}, EventEmitter.prototype, {

  init(ids) {
    var pIds = [];
    pIds.push(create(
      i18n.getMessage("sampleAnime1Title"), 
      3, 
      12,
      ids[0],
      null,
      i18n.getMessage("sampleAnime1Desc")
    ));
    pIds.push(create(
      i18n.getMessage("sampleAnime2Title"), 
      25, 
      25,
      ids[0],
      null,
      i18n.getMessage("sampleAnime2Desc")
    ));
    pIds.push(create(
      i18n.getMessage("sampleBook1Title"), 
      350, 
      600,
      ids[1],
      null,
      i18n.getMessage("sampleBook1Desc")
    ));
    pIds.push(create(
      i18n.getMessage("sampleBook2Title"), 
      300, 
      500,
      ids[1],
      null,
      i18n.getMessage("sampleBook2Desc")
    ));
    pIds.push(create(
      i18n.getMessage("sampleOther1Title"), 
      1, 
      10,
      ids[2],
      null,
      i18n.getMessage("sampleOther1Desc")
    ));

    MissionStore.persist();
    MissionStore.emitChange();

    return pIds;
  },

  loadMissions(missions) {
    _missions = missions;
  },

  getAll() {
    return _missions;
  },

  getEditing() {
    return _editing;
  },

  getLengthByCategory(category) {
    var length = 0;
    for (var i in _missions) {
      if (_missions[i].category === category) {
        length++;
      }
    }
    return length;
  },

  getCompleted() {
    var completed = 0;
    for (var i in _missions) {
      if (_missions[i].current >= _missions[i].total) {
        completed++;
      }
    }
    return completed;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  persist() {
    Storage.set({'_missions': _missions}, function() {});
  },

  clear() {
    Storage.remove('_missions');
  }

});

AppDispatcher.register(function(action) {
  var title;

  switch(action.actionType) {
    case MissionConstants.MISSION_CREATE:
      title = action.title.trim();
      if (title !== '') {
        action.id = create(title, action.current, action.total, action.category, action.type, action.description);
      }
      break;

    case MissionConstants.MISSION_EDITING:
      setEditing(action.mission);
      break;

    case MissionConstants.MISSION_DESTROY:
      destroy(action.id);
      break;

    case MissionConstants.MISSION_DESTROY_BY_CATEGORY:
      destoryByCategory(action.categoryId);
      break;

    case MissionConstants.MISSION_UPDATE:
      title = action.title.trim();
      if (title !== '') {
        update(action.id, title, action.current, action.total, action.category, action.type, action.description);
      }
      break;

    case MissionConstants.MISSION_UPDATE_MISSION:
      updateMission(action.id, action.current);
      break;

    default:
      return true;
  }

  MissionStore.persist();
  MissionStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = MissionStore;