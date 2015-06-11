var React = require('react'),
    MissionBoard = require('./components/MissionBoard');
    
require("jquery");
require("nouislider");
require("bootstrap");
require('sweetalert');

React.render(
  <MissionBoard />,
  document.getElementById('mission-board')
);