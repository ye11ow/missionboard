require("babel-polyfill");
window.jQuery = window.$ = require("jquery");
require("bootstrap");

var React = require('react'),
    ReactDom = require("react-dom"),
    MissionStore = require('./stores/MissionStore'),
    CategoryStore = require('./stores/CategoryStore'),
    introguide = require('./helpers/Introguide'),
    Storage = require('./helpers/Storage'),
    MissionBoard = require('./components/MissionBoard');

var Loader = React.createClass({
  render() {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  },
});

ReactDom.render(
  <Loader />,
  document.getElementById('mission-board')
);

Storage.get(['_inited', '_categories', '_missions', '_progresses'] , function(data){
  if ('_inited' in data && data['_inited'] === true) {
    if (data._progresses) {
      MissionStore.loadMissions(data._progresses);
      MissionStore.persist();
      Storage.remove('_progresses');
    } else {
      MissionStore.loadMissions(data._missions);
    }
    // promise here
    CategoryStore.loadCategories(data._categories);
    
  } else {
    Storage.set({'_inited': true});
    var ids = CategoryStore.init();
    MissionStore.init(ids);

    setTimeout(function() {
      introguide.startIntro();
    }, 400);
  }

  ReactDom.render(
    <MissionBoard />,
    document.getElementById('mission-board')
  );
});