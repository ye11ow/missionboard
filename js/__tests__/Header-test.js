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

  it("selected filter", function() {
    var React = require("react/addons"),
        Header = require("../components/Header.js"),
        HeaderStore = require("../stores/HeaderStore.js"),
        TestUtils = React.addons.TestUtils;

    var header = TestUtils.renderIntoDocument(
      <Header />
    );
    var filter = TestUtils.findRenderedDOMComponentWithClass(header, "progress-filter"),
        filterItem = filter.getDOMNode().querySelector('[data-filter="all"]');

    TestUtils.Simulate.click(filterItem);
    expect(HeaderStore.getFilter()).toBe("all");
  });

  it("selected order", function() {
    var React = require("react/addons"),
        Header = require("../components/Header.js"),
        HeaderStore = require("../stores/HeaderStore.js"),
        TestUtils = React.addons.TestUtils;

    var header = TestUtils.renderIntoDocument(
      <Header />
    );
    var order = TestUtils.findRenderedDOMComponentWithClass(header, "progress-order"),
        orderItem = order.getDOMNode().querySelector('[data-orderby="percent"]');

    TestUtils.Simulate.click(orderItem);
    expect(HeaderStore.getOrderby()).toEqual({
      by: 'percent',
      type: 'asc'
    });
  });
});