/**
 *
 * @jsx React.DOM
 */

var React = require('react');
var ProgressActions = require('./actions/ProgressActions');

var MissionBoard = require('./components/MissionBoard');

var CategoryStore = require('./stores/CategoryStore');
SyncDaemon = require('./helpers/SyncHelper');

React.render(
  <MissionBoard />,
  document.getElementById('mission-board'),
  function () {
  }
);

SyncDaemon.start();

