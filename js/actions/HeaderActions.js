var AppDispatcher = require('../dispatcher/AppDispatcher'),
    HeaderConstants = require('../constants/HeaderConstants');

var HeaderActions = {

  search: function(keyword) {
    AppDispatcher.dispatch({
      actionType: HeaderConstants.HEADER_SEARCH,
      keyword: keyword
    });
  },

  filter: function(filter) {
    AppDispatcher.dispatch({
      actionType: HeaderConstants.HEADER_UPDATE_FILTER,
      filter: filter
    });
  },

  orderby: function(orderby) {
    AppDispatcher.dispatch({
      actionType: HeaderConstants.HEADER_UPDATE_ORDERBY,
      orderby: orderby
    });
  },

};

module.exports = HeaderActions;
