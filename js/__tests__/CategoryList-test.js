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

  var React = require("react/addons"),
    CategoryList = require("../components/CategoryList.js"),
    CategoryStore = require("../stores/CategoryStore.js"),
    TestUtils = React.addons.TestUtils;

  var categoryListVDOM = null;

  beforeEach(function() {
    categoryListVDOM = TestUtils.renderIntoDocument(
      <CategoryList category={category} categories={categoryList}
          onCategorySwitch={mockFunction}
          onCategoryCreate={mockFunction}
          onCategoryDestroy={mockFunction} />
    );
  })

  it("should be rendered properly", function() {
    var categories = categoryListVDOM.getDOMNode().querySelectorAll(".category");
    var activeCategory = categoryListVDOM.getDOMNode().querySelectorAll(".category.active");
    //var categoryAdd = categoryListVDOM.getDOMNode().querySelector(".category-add");

    expect(categories.length).toBe(categoryList.length);
    expect(activeCategory.length).toBe(1);
  });

  it("should change current selected category", function() {
    var categories = categoryListVDOM.getDOMNode().querySelectorAll(".category");
    var activeCategory = categoryListVDOM.getDOMNode().querySelectorAll(".category.active");

    expect(categories[2].className).not.toContain("active");

    TestUtils.Simulate.click(categories[2]);
    //expect(categories[2].className).toContain("active");
  });

  it("should display update title dialog", function() {
    var categories = categoryListVDOM.getDOMNode().querySelectorAll(".category");
    var activeCategory = categoryListVDOM.getDOMNode().querySelectorAll(".category.active");

    //TestUtils.Simulate.doubleClick(categories[2]);
    //expect(categories[2].className).toContain("active");
  });

  it("should display add category input", function() {
    var addBtn = categoryListVDOM.getDOMNode().querySelector(".category-add");
    var confirmBtn = categoryListVDOM.getDOMNode().querySelector(".category-confirm");
    var cancelBtn = categoryListVDOM.getDOMNode().querySelector(".category-cancel");
    var cateogryTitle =  categoryListVDOM.getDOMNode().querySelector(".category-title");


    expect(addBtn.className).not.toContain("ani-invisible");
    expect(cateogryTitle.className).toContain("ani-invisible");
    expect(confirmBtn.className).toContain("ani-invisible");
    expect(cancelBtn.className).toContain("ani-invisible");
    
    TestUtils.Simulate.click(addBtn);
    expect(addBtn.className).toContain("ani-invisible");
    expect(cateogryTitle.className).not.toContain("ani-invisible");
    expect(confirmBtn.className).not.toContain("ani-invisible");
    expect(cancelBtn.className).not.toContain("ani-invisible");
  });


});