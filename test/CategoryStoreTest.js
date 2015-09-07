var assert = require("assert");
var sinon = require("sinon");


/**
 * Test cases for CategoryStore and CategoryActions
 * @todo Action::updateOrder
 */ 
describe('CategoryStore', function() {

  var CategoryStore = require("../js/stores/CategoryStore"),
      CategoryActions = require("../js/actions/CategoryActions"),
      CategoryConstants = require('../js/constants/CategoryConstants');

  before(function () {
  });

  describe('#init()', function() {
    var persist = sinon.stub(CategoryStore, "persist");
    var clear = sinon.stub(CategoryStore, "clear");

    it('should return some ids', function(){
      var ids = CategoryStore.init();

      sinon.assert.called(persist)

      assert.equal(ids.length, 3);
    });
  });

  describe('#getCurrentCategory()', function() {
    it('should return current category', function(){
      assert.equal(CategoryConstants.CATEGORY_ALLID, CategoryStore.getCurrentCategory());
    });
  });

  describe('#getAll()', function() {
    it('should return all the categories', function() {
      var categories = CategoryStore.getAll();

      assert.equal(Object.keys(categories).length, 4);
    });
  });

  describe('#loadCategories()', function() {
    it('should load some categories', function() {
      var categoriesBak = CategoryStore.getAll();

      CategoryStore.loadCategories([]);
      var categories = CategoryStore.getAll();

      assert.equal(Object.keys(categories).length, 1);

      CategoryStore.loadCategories(categoriesBak);
      categories = CategoryStore.getAll();

      assert.equal(Object.keys(categories).length, 4);
    });
  });

  describe('#Action::create', function() {
    it('should create a new category', function() {
      var prevCount = Object.keys(CategoryStore.getAll()).length;
      CategoryActions.create("TITLE", 1);

      assert.equal(Object.keys(CategoryStore.getAll()).length, prevCount + 1);
    });

    it('should failed when title is empty', function() {
      var prevCount = Object.keys(CategoryStore.getAll()).length;
      CategoryActions.create("", 1);

      assert.equal(Object.keys(CategoryStore.getAll()).length, prevCount);
    });
  });

  describe('#Action::switch', function() {
    it('should switch to a new category', function() {
      var id = Object.keys(CategoryStore.getAll())[3];

      CategoryActions.switch(id);

      assert.equal(id, CategoryStore.getCurrentCategory());
    });

    it('should switch to default category when target is not found', function() {
      CategoryActions.switch("THIS IS A WRONG ID");

      assert.equal(CategoryConstants.CATEGORY_ALLID, CategoryStore.getCurrentCategory());    
    });
  });

  describe('#Action::updateTitle', function() {
    it('should update the category title', function() {
      const title = "THIS IS A NEW TITLE";
      var id = Object.keys(CategoryStore.getAll())[2];

      CategoryActions.updateTitle(id, title);

      assert.equal(CategoryStore.getAll()[id].title, title);
    });

    it('should not update the category title when new title is empty', function() {
      const title = "";
      var id = Object.keys(CategoryStore.getAll())[2];
      var prevTitle = CategoryStore.getAll()[id].title;

      CategoryActions.updateTitle(id, title);

      assert.equal(CategoryStore.getAll()[id].title, prevTitle);
    });
  });

  describe('#Action::destroy', function() {
    it('should destroy a category', function() {
      var prevCount = Object.keys(CategoryStore.getAll()).length;

      var id = Object.keys(CategoryStore.getAll())[2];

      CategoryActions.destroy(id);

      assert.equal(Object.keys(CategoryStore.getAll()).length, prevCount - 1);
    });

    it('should change current category to default when destroy selected category', function() {
      var prevCount = Object.keys(CategoryStore.getAll()).length;
      var id = Object.keys(CategoryStore.getAll())[0];

      assert.notEqual(id, CategoryConstants.CATEGORY_ALLID);

      CategoryActions.switch(id);
      CategoryActions.destroy(id);

      assert.equal(Object.keys(CategoryStore.getAll()).length, prevCount - 1);
      assert.equal(CategoryConstants.CATEGORY_ALLID, CategoryStore.getCurrentCategory());
    });
  });

})