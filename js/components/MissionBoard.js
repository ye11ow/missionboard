var React = require('react'),
    Header = require('./Header'),
    ProgressList = require('./ProgressList'),
    CategoryList = require('./CategoryList'),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryActions = require('../actions/CategoryActions'),
    CategoryConstants = require('../constants/CategoryConstants'),
    progressCollection = require('../stores/ProgressCollection');

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

var MissionBoard = React.createClass({

  getInitialState: function() {
    return getProgressState();
  },

  componentDidMount: function() {
    var self = this;
    console.log(self.state.progressCollection);
    this.state.progressCollection.on('add remove change', function() {
      console.log("progrescolelction changed");
      self.forceUpdate.bind(self, null);
    });
    CategoryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    this.state.progressCollection.off(null, null, this);
    CategoryStore.removeChangeListener(this._onChange);
  },

  handleCategorySwitch: function(id) {
    CategoryActions.switch(id);
  },

  handleCategoryDestroy: function(id) {
    // no set state here, the setState will be triggered by changeListener.
    progressCollection.deleteByCategory(id);
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

    for (var key in categories) {
      var category = categories[key];
      category.count = progresses.countByCategory(key);
    }

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
