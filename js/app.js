var React = require('react'),
    ProgressStore = require('./stores/ProgressStore'),
    CategoryStore = require('./stores/CategoryStore'),
    introguide = require('./helpers/Introguide'),
    Storage = require('./helpers/Storage'),
    MissionBoard = require('./components/MissionBoard');

require("babel/polyfill");
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

Storage.get(['_inited', '_categories', '_progresses'] , function(data){
  if ('_inited' in data && data['_inited'] === true) {
    // promise here
    CategoryStore.loadCategories(data._categories);
    ProgressStore.loadProgresses(data._progresses);
  } else {
    Storage.set({'_inited': true});
    var ids = CategoryStore.init();
    ProgressStore.init(ids);

    setTimeout(function() {
      introguide.startIntro();
    }, 400);
  }

  React.render(
    <MissionBoard />,
    document.getElementById('mission-board')
  );
});