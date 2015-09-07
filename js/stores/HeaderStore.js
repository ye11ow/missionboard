var AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events').EventEmitter,
    HeaderConstants = require('../constants/HeaderConstants'),
    HeaderActions = require('../actions/HeaderActions');

const CHANGE_EVENT = 'change';

var _filter = HeaderConstants.HEADER_FILTER_CURRENT,
    _orderby = {
      type: "desc",
      by: "title"
    },
    _keyword = "";

function updateKeyword(keyword) {
  _keyword = keyword;
}

function updateFilter(filter) {
  _filter = filter;
}

function updateOrderby(orderby) {
  _orderby = orderby;
}


var HeaderStore = Object.assign({}, EventEmitter.prototype, {

  init() {
  },

  getKeyword() {
    return _keyword;
  },

  getFilter() {
    return _filter;
  },

  getOrderby() {
    return _orderby;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case HeaderConstants.HEADER_SEARCH:
      updateKeyword(action.keyword);
      break;

    case HeaderConstants.HEADER_UPDATE_ORDERBY:
      updateOrderby(action.orderby);
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