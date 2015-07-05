var AppDispatcher = require('../dispatcher/AppDispatcher'),
    HeaderConstants = require('../constants/HeaderConstants');

var HeaderActions = {

  search(keyword) {
    AppDispatcher.dispatch({
      actionType: HeaderConstants.HEADER_SEARCH,
      keyword
    });
  },

  filter(filter) {
    AppDispatcher.dispatch({
      actionType: HeaderConstants.HEADER_UPDATE_FILTER,
      filter
    });
  },

  orderby(orderby) {
    AppDispatcher.dispatch({
      actionType: HeaderConstants.HEADER_UPDATE_ORDERBY,
      orderby
    });
  },

};

module.exports = HeaderActions;
