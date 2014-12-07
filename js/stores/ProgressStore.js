var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProgressConstants = require('../constants/ProgressConstants');
var utils = require('../helpers/Utils.js');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _progresses = {};
var _syncList = {};
var _length = 0;


/**
 * Create a Progress.
 */
function create(title, current, total, category, type, description) {
  var progress = {
    id: utils.UUID(),
    title: title,
    current: current,
    total: total,
    completed: current >= total ? true : false,
    category: category,
    type: type,
    description: description,
    createdAt: Date.now(),
  };
     
  _progresses[progress.id] = progress;
  _length++;

  return progress.id;
}

/**
 * Delete a Progress.
 * @param  {string} id
 */
function destroy(id) {
  delete _progresses[id];
  _length--;
}

function update(id, title, current, total, category, type, description) {
  var progress = _progresses[id];
  if (progress) {
    if (title && title.length > 0) {
      progress.title = title;
    }
    if (current && typeof current === "number") {
      progress.current = current;
    }
    if (total && typeof total === "number") {
      progress.total = total;
    }
    if (category && category.length > 0) {
      progress.category = category;
    }
    if (type && type.length > 0) {
      progress.type = type;
    }
    if (description && description.length > 0) {
      progress.description = description;
    }
    progress.completed = (progress.current >= progress.total);
  }

  $.ajax({
    type: "PUT",
    url: SERVER + "/missions/" + id,
    data: progress
  }).done(function( data ) {
    console.log(data);

    ProgressStore.emitChange();
  });
}

function updateProgress(id, current) {
  var progress = _progresses[id];
  if (progress) {
    if (current && typeof current === "number") {
      if (current === -1) {
        current = progress.total;
      }
      progress.current = current;
    }
    progress.completed = (progress.current >= progress.total);
  }
}

var ProgressStore = merge(EventEmitter.prototype, {

  setProgresses: function(progresses) {
    _progresses = progresses;
    if (progresses && typeof progresses === "object") {
      _length = Object.keys(progresses).length;
    } else {
      _length = 0;
    }
    if (localStorage["progresses"] && localStorage["progresses.sync"]) {
      var localProgresses = JSON.parse(localStorage["progresses"]);
      _syncList = JSON.parse(localStorage["progresses.sync"]);
      for (var id in _syncList) {
        if (localProgresses[id]) {
          _progresses[id] = localProgresses[id];
        }
      }
    }
  },

  getAll: function() {
    return _progresses;
  },

  getLengthByCategory: function(category) {
    var length = 0;
    for (var i in _progresses) {
      if (_progresses[i].category === category) {
        length++;
      }
    }
    return length;
  },

  getLength: function() {
    return _length;
  },

  getCompleted: function() {
    var completed = 0;
    for (var i in _progresses) {
      if (_progresses[i].current >= _progresses[i].total) {
        completed++;
      }
    }
    return completed;
  },

  getSyncs: function() {
    return _syncList;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  sync: function() {
    for (var id in _syncList) {
      var actionType = _syncList[id].actionType;
      var progress = _progresses[id];

      switch(actionType) {
        case ProgressConstants.PROGRESS_CREATE:
          $.post( SERVER + "/missions/", progress, function(data) {
            delete _syncList[id];
            console.log(data);
            ProgressStore.emitChange();
          });
          break;

        case ProgressConstants.PROGRESS_UPDATE:
          $.ajax({
            type: "PUT",
            url: SERVER + "/categories/" + id,
            data: category
          }).done(function( data ) {
            delete _syncList[id];
            console.log(data);
            CategoryStore.emitChange();
          });
          break;

        case ProgressConstants.PROGRESS_UPDATE_PROGRESS:
          $.ajax({
            type: "PUT",
            url: SERVER + "/missions/" + id + "/progress",
            data: progress
          }).done(function( data ) {
            delete _syncList[id];
            console.log(data);
            ProgressStore.emitChange();
          });
          break;

        case ProgressConstants.PROGRESS_DESTROY:
          $.ajax({
            type: "DELETE",
            url: SERVER + "/missions/" + id
          }).done(function( data ) {
            delete _syncList[id];
            console.log(data);
            ProgressStore.emitChange();
          });
          break;

        default:
          return true;
      }
    }
  },

  persist: function() {
    localStorage["progresses"] = JSON.stringify(_progresses);
    localStorage["progresses.sync"] = JSON.stringify(_syncList);
  },

  clear: function() {
    localStorage["progresses"] = "";
    localStorage["progresses.sync"] = "";
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  var title;

  switch(action.actionType) {
    case ProgressConstants.PROGRESS_CREATE:
      title = action.title.trim();
      if (title !== '') {
        action.id = create(title, action.current, action.total, action.category, action.type, action.description);
      }
      break;

    case ProgressConstants.PROGRESS_DESTROY:
      destroy(action.id);
      break;

    case ProgressConstants.PROGRESS_UPDATE:
      title = action.title.trim();
      current = action.current;
      total = action.total;
      if (title !== '') {
        update(action.id, title, action.current, action.total, action.category, action.type, action.description);
      }
      break;

    case ProgressConstants.PROGRESS_UPDATE_PROGRESS:
      updateProgress(action.id, action.current);
      break;

    default:
      return true;
  }

  if (_syncList[action.id]) {
    if (_syncList[action.id].actionType === ProgressConstants.CATEGORY_CREATE) {
      if (action.actionType === ProgressConstants.CATEGORY_DESTROY) {
        delete _syncList[action.id];
      } else {
        return;
      }
    }
  } else {
    _syncList[action.id] = {
      actionType: action.actionType
    }
  }

  ProgressStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = ProgressStore;