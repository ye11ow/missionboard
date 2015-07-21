var assert = require("assert");
var React = require("react/addons");
var sinon = require("sinon");

describe('CategoryStore', function(){

  var CategoryStore = require("../js/stores/CategoryStore");
  before(function () {
    
  })

  describe('#init()', function(){
    var persist = sinon.stub(CategoryStore, "persist");
    var clear = sinon.stub(CategoryStore, "clear");

    it('should return some ids', function(){
      var ids = CategoryStore.init();

      sinon.assert.called(persist)

      assert.equal(ids.length, 3);
    });
  });

  describe('#switchCategory(), #getCurrentCategory()', function(){
    it('should load switch to another category', function(){
      const oldCategory = "1";
      const newCateogry = "2";

      CategoryStore.switchCategory(oldCategory);
      assert.equal(oldCategory, CategoryStore.getCurrentCategory());

      CategoryStore.switchCategory(newCateogry);
      assert.equal(newCateogry, CategoryStore.getCurrentCategory());
    });
  });

  describe('#getAll()', function(){
    it('should return all the categories', function(){
      var categories = CategoryStore.getAll();

      assert.equal(Object.keys(categories).length, 4);
    });
  });

  // describe('#loadCategories()', function(){
  //   it('should load all categories', function(){
  //     console.log(CategoryStore.getAll());
  //     var items = CategoryStore.loadCategories();
  //     console.log(items);
  //   });
  // });
})