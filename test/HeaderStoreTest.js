var assert = require("assert");
var sinon = require("sinon");

/**
 * Test cases for HeaderStore and HeaderActions
 * @todo Action::updateOrderby
 */ 
describe('HeaderStore', function() {

  var HeaderStore = require("../js/stores/HeaderStore"),
      HeaderActions = require("../js/actions/HeaderActions"),
      HeaderConstants = require('../js/constants/HeaderConstants');

  before(function () {
  });

  describe('#getKeyword() & #Action::search', function() {
    it('should update and return keyword', function() {
      var prevKeyword = HeaderStore.getKeyword();
      const keyword = "MY KEYWORD";

      assert.notEqual(prevKeyword, keyword);

      HeaderActions.search(keyword);

      assert.equal(HeaderStore.getKeyword(), keyword);
    });
  });

  describe('#getFilter() & #Action::filter', function() {
    it('should update and return filter', function() {
      var prevFilter = HeaderStore.getFilter();
      const filter = HeaderConstants.HEADER_FILTER_COMPLETED;

      assert.notEqual(prevFilter, filter);

      HeaderActions.filter(filter);

      assert.equal(HeaderStore.getFilter(), filter);
    });
  });

  // describe('#getOrderby() & #Action::orderby', function() {
  //   it('should update and return orderby', function() {
  //     var prevOrderby = HeaderStore.getOrderby();
  //     const orderby = HeaderConstants.HEADER_FILTER_COMPLETED;

  //     assert.notEqual(prevOrderby, orderby);

  //     HeaderActions.orderby(orderby);

  //     assert.equal(HeaderStore.getOrderby(), orderby);
  //   });
  // });

})