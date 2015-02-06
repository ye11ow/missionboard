var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    HeaderConstants = require('../constants/HeaderConstants'),
    HeaderActions = require('../actions/HeaderActions');

var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _filter = null,
    _keyword = "";

function updateKeyword(keyword) {
  _keyword = keyword;
}

function updateFilter(filter) {
  _filter = filter;
}


var HeaderStore = assign({}, EventEmitter.prototype, {

  init: function() {
  },

  getKeyword: function() {
    return _keyword;
  },

  getFilter: function() {
    return _filter;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

AppDispatcher.register(function(action) {
  var title;

  switch(action.actionType) {
    case HeaderConstants.HEADER_SEARCH:
      updateKeyword(action.keyword);
      break;

    case HeaderConstants.HEADER_UPDATE_ORDERBY:
      break;

    case HeaderConstants.HEADER_UPDATE_FILTER:
      updateFilter(action.filter);
      break;

    default:
      return true;
  }

  HeaderStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});


module.exports = HeaderStore;