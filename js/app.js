var React = require('react'),
    MissionBoard = require('./components/MissionBoard');

require("jquery");
require("nouislider");
require("bootstrap");
require('sweetalert');

var Loader = React.createClass({
  render: function() {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  },
});

React.render(
  <Loader />,
  document.getElementById('mission-board')
);

setTimeout(function() {
  React.render(
    <MissionBoard />,
    document.getElementById('mission-board')
  );
}, 500);