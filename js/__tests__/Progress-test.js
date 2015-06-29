jest.autoMockOff();

var PROGRESS = {
  id: "1",
  title: "Test progress",
  current: 10,
  total: 30,
  completed: false,
  category: "1",
  type: "1",
  description: "Test description",
  createdAt: Date.now(),
};

describe("Progress", function() {

  /*var React = require("react/addons"),
      Progress = require("../components/Progress.js"),
      ProgressStore = require("../stores/ProgressStore.js"),
      TestUtils = React.addons.TestUtils;

  var progressVDOM = null;

  beforeEach(function() {
    progressVDOM = TestUtils.renderIntoDocument(
      <Progress keyword={""} key={PROGRESS.id} progress={PROGRESS} />
    );
  })

  it("should be rendered properly", function() {
    var input = header.refs.searchInput.getDOMNode();

    TestUtils.Simulate.change(input, {target: {value: "Hello, world"}});
    expect(HeaderStore.getKeyword()).toBe("Hello, world");
  });
  */
});