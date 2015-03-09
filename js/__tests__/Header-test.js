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

describe("Header", function() {
  it("start searching after input text", function() {
    var React = require("react/addons"),
        Header = require("../components/Header.js"),
        HeaderStore = require("../stores/HeaderStore.js"),
        TestUtils = React.addons.TestUtils;

    var header = TestUtils.renderIntoDocument(
      <Header />
    );
    var input = header.refs.searchInput.getDOMNode();

    TestUtils.Simulate.change(input, {target: {value: "Hello, world"}});
    expect(HeaderStore.getKeyword()).toBe("Hello, world");
  });

  it("", function() {
    var React = require("react/addons"),
        Header = require("../components/Header.js"),
        HeaderStore = require("../stores/HeaderStore.js"),
        TestUtils = React.addons.TestUtils;

    var header = TestUtils.renderIntoDocument(
      <Header />
    );
    var filter = TestUtils.findRenderedDOMComponentWithClass(header, "progress-filter"),
        filterItem = filter.getDOMNode().querySelector('[data-filter="all"]');

    //TestUtils.Simulate.click(filterItem);

    console.log(HeaderStore.getFilter());
  });
});