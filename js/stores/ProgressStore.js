var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProgressConstants = require('../constants/ProgressConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _progresses = {};
var _length = 0;

/**
 * Create a Progress.
 */
function create(title, current, total, category, type, description) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp in place of a real id.
  var progress = {
    title: title,
    current: current,
    total: total,
    completed: current >= total ? true : false,
    category: category,
    type: type,
    description: description,
    createdAt: Date.now(),
  };
  $.post( SERVER + "/missions/", progress, function(data) {
    console.log(data);
    _length++;
  });
}

/**
 * Delete a Progress.
 * @param  {string} id
 */
function destroy(id) {
  $.ajax({
    type: "DELETE",
    url: SERVER + "/missions/" + id
  }).done(function( data ) {
    delete _progresses[id];
    _length--;
  });
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
  });
}

function doit(id, current) {
  var progress = _progresses[id];
  if (progress) {
    if (current && typeof current === "number") {
      progress.current = current;
    }
    progress.completed = (progress.current >= progress.total);
    $.ajax({
      type: "PUT",
      url: SERVER + "/missions/" + id + "/doit",
      data: progress
    }).done(function( data ) {
      console.log(data);
    });
  }
}

var ProgressStore = merge(EventEmitter.prototype, {

  setProgresses: function(progresses, length) {
    _progresses = progresses;
    _length = length;
  },

  getAll: function() {
    return _progresses;
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
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  var title;

  switch(action.actionType) {
    case ProgressConstants.PROGRESS_CREATE:
      title = action.title.trim();
      if (title !== '') {
        create(title, action.current, action.total, action.category, action.type, action.description);
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

    case ProgressConstants.PROGRESS_DOIT:
      doit(action.id, action.current);
      break;

    default:
      return true;
  }

  ProgressStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = ProgressStore;