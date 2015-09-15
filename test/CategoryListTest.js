// var jsdom          = require("jsdom").jsdom;
// global.document    = jsdom('<html><body></body></html>');
// global.window      = global.document.defaultView;
var jsdom = require('mocha-jsdom');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require("chai").assert;
var sinon = require("sinon");

describe('CategoryList', function() {

  jsdom();

  var Storage = require('../js/helpers/Storage');
  var CATEGORIES = require('./texture/categories');
  var categories = require('./texture/categories');
  var CategoryList, categoryList, storageGet, storageSet;

  before(function () {
    storageGet = sinon.stub(Storage, "get");
    storageSet = sinon.stub(Storage, "set");
    categories = [];
    for (var key in CATEGORIES) {
      categories.push(CATEGORIES[key]);
    }
  });

  describe('#render()', function() {
    it('should render', function() {
        CategoryList = require("../js/components/CategoryList");
        categoryList = TestUtils.renderIntoDocument(<CategoryList category={categories[2]} categories={categories} />)        
        var list = TestUtils.findRenderedDOMComponentWithClass(categoryList, "nav").getDOMNode();
        var active = list.querySelector(".active");

        assert.isAbove(active.innerHTML.indexOf(categories[2].title), -1);
    });
  });

  describe('#handleCategoryClick()', function() {
    it('should switch category', function() {
        CategoryList = require("../js/components/CategoryList");
        categoryList = TestUtils.renderIntoDocument(<CategoryList category={categories[0]} categories={categories} />)        
        var list = TestUtils.findRenderedDOMComponentWithClass(categoryList, "nav").getDOMNode();
        var active = list.querySelector(".active");

        assert.isAbove(active.innerHTML.indexOf(categories[0].title), -1);

        var another = active.nextElementSibling;
        var reactAnother = React.findDOMNode(another);

        TestUtils.Simulate.click(reactAnother);

        list = TestUtils.findRenderedDOMComponentWithClass(categoryList, "nav").getDOMNode();
        active = list.querySelector(".active");
        // assert.equal(active.innerHTML.indexOf(categories[0].title), -1);
        // assert.isAbove(active.innerHTML.indexOf(categories[1].title), -1);
    });
  });

  describe('#handleCategoryDoubleClick()', function() {
    it('should edit a category', function() {
        CategoryList = require("../js/components/CategoryList");
        categoryList = TestUtils.renderIntoDocument(<CategoryList category={categories[1]} categories={categories} />)        
        var list = TestUtils.findRenderedDOMComponentWithClass(categoryList, "nav").getDOMNode();
        var active = list.querySelector(".active");


        // TestUtils.Simulate.doubleClick(active);

        // list = TestUtils.findRenderedDOMComponentWithClass(categoryList, "nav").getDOMNode();
        // active = list.querySelector(".active");
        // assert.equal(active.innerHTML.indexOf(categories[0].title), -1);
        // assert.isAbove(active.innerHTML.indexOf(categories[1].title), -1);
    });
  });

});