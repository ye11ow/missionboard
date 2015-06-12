var React = require('react'),
    Header = require('./Header'),
    ProgressList = require('./ProgressList'),
    CategoryList = require('./CategoryList'),
    ProgressActions = require('../actions/ProgressActions'),
    ProgressStore = require('../stores/ProgressStore'),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryActions = require('../actions/CategoryActions'),
    CategoryConstants = require('../constants/CategoryConstants'),
    introguide = require('../helpers/Introguide'),
    progressCollection = require('../stores/ProgressCollection');

function calcCategoryCount(categories, progresses) {
  for (var key in categories) {
    var category = categories[key];
    category.count = 0;
  }

  for (var key in progresses) {
    var category = categories[progresses[key].category];
    if (!progresses[key].completed) {
      category.count++;
      categories[CategoryConstants.CATEGORY_ALLID].count++;
    }
  }
}

function sortCategory(cA, cB) {
  return cA.order - cB.order;
}

function getProgressState() {
  return {
    progressCollection: progressCollection,
    categories: CategoryStore.getAll(),
    category: CategoryStore.getCurrentCategory()
  };
}

function init() {
  var ids = CategoryStore.init();
  //ProgressStore.init(ids);

  setTimeout(function() {
    introguide.startIntro();
  }, 400);
}

var MissionBoard = React.createClass({

  getInitialState: function() {
    return getProgressState();
  },

  componentDidMount: function() {
    this.state.progressCollection.on('add remove change', this.forceUpdate.bind(this, null))

    var self = this;
    //ProgressStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);

    chrome.storage.sync.get('_inited', function(inited){
      if ('_inited' in inited && inited['_inited'] === true) {
        chrome.storage.sync.get(['_categories', '_progresses'], function(data){
          // promise here
          CategoryStore.loadCategories(data._categories);
          //ProgressStore.loadProgresses(data._progresses);

          self.setState(getProgressState());
        });
      } else {
        chrome.storage.sync.set({'_inited': true}); 
        init.call(this);
      }
    });
  },

  componentWillUnmount: function() {
    this.state.progressCollection.off(null, null, this);
    //ProgressStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
  },

  handleCategorySwitch: function(id) {
    CategoryActions.switch(id);
  },

  handleCategoryDestroy: function(id) {
    // no set state here, the setState will be triggered by changeListener.
    var progresses = this.state.progresses;
    for (var key in progresses) {
      if (progresses[key].category === id) {
        ProgressActions.destroy(key);
      }
    }
    CategoryActions.destroy(id);
  },

  handleCategoryCreate: function(category) {
    // no set state here, the setState will be triggered by changeListener.
    CategoryActions.create(category.title, category.order);
  },

  render: function() {
    console.log("render");
    var progresses = this.state.progressCollection,
        categories = this.state.categories,
        categoryList = [],
        _progresses = {},
        category = null;

    if (this.state.category) {
      category = categories[this.state.category];
    }

    // a key is need here for Progress.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    /*for (var key in progresses) {
      var progress = progresses[key];
      if (!category || progress.category === category.id || category.system === true) {
        _progresses[key] = progress;
      }
    }

    calcCategoryCount(categories, progresses);*/
    for (var key in categories) {
      categoryList.push(categories[key]);
    }
    categoryList.sort(sortCategory);

    return (
      <div>
        <Header />

        <CategoryList category={category} categories={categoryList}
          onCategorySwitch={this.handleCategorySwitch}
          onCategoryCreate={this.handleCategoryCreate}
          onCategoryDestroy={this.handleCategoryDestroy} />

        <ProgressList progresses={progresses} category={category} categories={categoryList} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getProgressState());
  }
});

module.exports = MissionBoard;
