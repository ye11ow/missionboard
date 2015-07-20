var assert = require("assert");
var React = require("react/addons");
var sinon = require("sinon");

describe('CategoryStore', function(){

  before(function () {
    
  })

  describe('#init()', function(){
    var CategoryStore = require("../js/stores/CategoryStore");
    var persist = sinon.stub(CategoryStore, "persist");
    var clear = sinon.stub(CategoryStore, "clear");

    it('should return some ids', function(){
      var ids = CategoryStore.init();

      sinon.assert.called(persist)

      assert.equal(ids.length, 3);
    });
  });

  describe('#loadCategories()', function(){
    var CategoryStore = require("../js/stores/CategoryStore");

    it('should load all categories', function(){
      var ids = CategoryStore.loadCategories();

      sinon.assert.called(persist)

      assert.equal(ids.length, 3);
    });
  });
})