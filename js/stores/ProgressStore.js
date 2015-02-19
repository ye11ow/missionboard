var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    ProgressConstants = require('../constants/ProgressConstants');

var utils = require('../helpers/Utils.js'),
    assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _progresses = {},
    _editing = null;

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

function setEditing(progress) {
  _editing = progress;
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
    
    progress.description = description;
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
      chrome.i18n.getMessage("sampleAnime1Title"), 
      3, 
      12,
      ids[0],
      null,
      chrome.i18n.getMessage("sampleAnime1Desc")
    );
    create(
      chrome.i18n.getMessage("sampleAnime2Title"), 
      25, 
      25,
      ids[0],
      null,
      chrome.i18n.getMessage("sampleAnime2Desc")
    );
    create(
      chrome.i18n.getMessage("sampleBook1Title"), 
      350, 
      600,
      ids[1],
      null,
      chrome.i18n.getMessage("sampleBook1Desc")
    );
    create(
      chrome.i18n.getMessage("sampleBook2Title"), 
      300, 
      500,
      ids[1],
      null,
      chrome.i18n.getMessage("sampleBook2Desc")
    );
    create(
      chrome.i18n.getMessage("sampleOther1Title"), 
      1, 
      10,
      ids[2],
      null,
      chrome.i18n.getMessage("sampleOther1Desc")
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

  getEditing: function() {
    return _editing;
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
    chrome.storage.sync.set({'_progresses': _progresses}, function() {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    });
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

    case ProgressConstants.PROGRESS_EDITING:
      setEditing(action.progress);
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