/**
 *
 * @jsx React.DOM
 */

var React = require('react');
var ProgressActions = require('./actions/ProgressActions');

var MissionBoard = require('./components/MissionBoard');

LOCAL_MODE = false;
SERVER = "http://localhost:3000"

React.render(
  <MissionBoard />,
  document.getElementById('mission-board'),
  function () {
  	/*ProgressActions.create("高达Seed", 37, 48, "video", "anime");
  	ProgressActions.create("ALDNOAH.ZERO", 0, 12, "video", "anime");
    ProgressActions.create("《哲学问题》", 40, 130, "book");
    ProgressActions.create("《黑客与画家》", 220, 220, "book");
    ProgressActions.create("《枪炮、病菌与钢铁》", 30, 362, "book");
    ProgressActions.create("ADC", 50, 50, "other");
    ProgressActions.create("BAC", 50, 50, "other");
    ProgressActions.create("ABC", 50, 50, "other");
    ProgressActions.create("BCD", 50, 50, "other");*/
  }
);

