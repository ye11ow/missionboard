var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    ProgressConstants = require('../constants/ProgressConstants');

var utils = require('../helpers/Utils.js'),
    assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _progresses = {};

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

  return progress.id;
}

/**
 * Delete a Progress.
 * @param  {string} id
 */
function destroy(id) {
  delete _progresses[id];
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

var ProgressStore = assign({}, EventEmitter.prototype, {

  init: function(ids) {
    create(
      "My Favorite Anime", 
      3, 
      12,
      ids[0],
      null,
      "This is my favorite anime"
    );
    create(
      "My Completed Anime", 
      24, 
      24,
      ids[0],
      null,
      ""
    );
    create(
      "My Favorite Book", 
      350, 
      600,
      ids[1],
      null,
      "This is my favorite book"
    );
    create(
      "Learn Mission Board", 
      1, 
      10,
      ids[2],
      null,
      "Learn some basic usage of Mission Board"
    );

    ProgressStore.persist();
    ProgressStore.emitChange();
  },

  loadProgresses: function(progresses) {
    _progresses = progresses;
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

  getCompleted: function() {
    var completed = 0;
    for (var i in _progresses) {
      if (_progresses[i].current >= _progresses[i].total) {
        completed++;
      }
    }
    return completed;
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

  persist: function() {
    chrome.storage.sync.set({'_progresses': _progresses});
  },

  clear: function() {
    chrome.storage.sync.remove('_progresses');
  }

});

AppDispatcher.register(function(action) {
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

  ProgressStore.persist();
  ProgressStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = ProgressStore;