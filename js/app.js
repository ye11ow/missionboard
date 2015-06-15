var React = require('react'),
    CategoryStore = require('./stores/CategoryStore'),
    progressCollection = require('./stores/ProgressCollection'),
    introguide = require('./helpers/Introguide'),
    MissionBoard = require('./components/MissionBoard');
    
require("jquery");
require("nouislider");
require("bootstrap");
require('sweetalert');

function render() {
  React.render(
    <MissionBoard />,
    document.getElementById('mission-board')
  );
}

chrome.storage.sync.get('_inited', function(inited){
  if ('_inited' in inited && inited['_inited'] === true) {
    chrome.storage.sync.get(['_categories', '_progresses'], function(data){
      // promise here
      CategoryStore.loadCategories(data._categories);
      progressCollection.loadProgresses(data._progresses);

      render();
    });
  } else {
    chrome.storage.sync.set({'_inited': true}); 
    var ids = CategoryStore.init();
    progressCollection.init(ids);

    render();

    setTimeout(function() {
      introguide.startIntro();
    }, 400);
  }
});