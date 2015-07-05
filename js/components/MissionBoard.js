var React = require('react'),
    Header = require('./Header'),
    ProgressList = require('./ProgressList'),
    CategoryList = require('./CategoryList'),
    ProgressStore = require('../stores/ProgressStore'),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryConstants = require('../constants/CategoryConstants');

function calcCategoryCount(categories, progresses) {
  for (var key in categories) {
    categories[key].count = 0;
  }

  for (var key in progresses) {
    if (!progresses[key].completed) {
      categories[progresses[key].category].count++;
      categories[CategoryConstants.CATEGORY_ALLID].count++;
    }
  }
}

function getProgressState() {
  return {
    progresses: ProgressStore.getAll(),
    categories: CategoryStore.getAll(),
    category: CategoryStore.getCurrentCategory()
  };
}

var MissionBoard = React.createClass({

  getInitialState() {
    return getProgressState();
  },

  componentDidMount() {
    ProgressStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    ProgressStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
  },

  render() {
    var progresses = this.state.progresses,
        categories = this.state.categories,
        currentProgresses = {},
        categoryList = [],
        category = null;


    if (this.state.category) {
      category = categories[this.state.category];
    }

    // a key is need here for Progress.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in progresses) {
      var progress = progresses[key];
      if (!category || progress.category === category.id || category.system === true) {
        currentProgresses[key] = progress;
      }
    }

    calcCategoryCount(categories, progresses);
    for (var key in categories) {
      categoryList.push(categories[key]);
    }
    categoryList.sort((cA, cB) => cA.order - cB.order);

    return (
      <div>
        <Header />

        <CategoryList category={category} categories={categoryList} />

        <ProgressList progresses={currentProgresses} category={category} categories={categoryList} />
      </div>
    );
  },

  _onChange() {
    this.setState(getProgressState());
  }
});

module.exports = MissionBoard;
