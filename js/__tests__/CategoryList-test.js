jest.autoMockOff();

chrome = {
  i18n: {
    getMessage: jest.genMockFunction()
  },
  storage: {
    sync: {
      get: jest.genMockFunction(),
      set: jest.genMockFunction()
    }
  }
};

var categoryList = [
  {
    id: 0,
    title: "All",
    order: 0,
    system: true,
    orderby: {
      by: "title",
      type: "asc"
    }
  },
  {
    id: 1,
    title: "test",
    order: 1,
    system: false,
    orderby: {
      by: "title",
      type: "asc"
    }
  },
  {
    id: 2,
    title: "test2",
    order: 2,
    system: false,
    orderby: {
      by: "title",
      type: "asc"
    }
  },
  {
    id: 3,
    title: "test3",
    order: 3,
    system: false,
    orderby: {
      by: "title",
      type: "asc"
    }
  },
];

var category = categoryList[1];
var mockFunction = function() {};

describe("CategoryList", function() {
  it("start searching after input text", function() {
    var React = require("react/addons"),
        CategoryList = require("../components/CategoryList.js"),
        CategoryStore = require("../stores/CategoryStore.js"),
        TestUtils = React.addons.TestUtils;

    var CategoryList = TestUtils.renderIntoDocument(
      <CategoryList category={category} categories={categoryList}
          onCategorySwitch={mockFunction}
          onCategoryCreate={mockFunction}
          onCategoryDestroy={mockFunction} />
    );

    var categories = CategoryList.getDOMNode().querySelectorAll(".category");
    var activeCategory = CategoryList.getDOMNode().querySelectorAll(".category.active");
    //var categoryAdd = CategoryList.getDOMNode().querySelector(".category-add");

    expect(categories.length).toBe(categoryList.length);
    expect(activeCategory.length).toBe(1);
  });
});