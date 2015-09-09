var React = require('react'),
    Header = require('./Header'),
    MissionList = require('./MissionList'),
    CategoryList = require('./CategoryList'),
    MissionStore = require('../stores/MissionStore'),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryConstants = require('../constants/CategoryConstants');

function calcCategoryCount(categories, missions) {
  for (var key in categories) {
    categories[key].count = 0;
  }

  for (var key in missions) {
    if (!missions[key].completed) {
      categories[missions[key].category].count++;
      categories[CategoryConstants.CATEGORY_ALLID].count++;
    }
  }
}

function getMissionState() {
  return {
    missions: MissionStore.getAll(),
    categories: CategoryStore.getAll(),
    category: CategoryStore.getCurrentCategory()
  };
}

var MissionBoard = React.createClass({

  getInitialState() {
    return getMissionState();
  },

  componentDidMount() {
    MissionStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    MissionStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
  },

  render() {
    var missions = this.state.missions,
        categories = this.state.categories,
        currentMissions = {},
        categoryList = [],
        category = null;


    if (this.state.category) {
      category = categories[this.state.category];
    }

    // a key is need here for Mission.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in missions) {
      var mission = missions[key];
      if (!category || mission.category === category.id || category.system === true) {
        currentMissions[key] = mission;
      }
    }

    calcCategoryCount(categories, missions);
    for (var key in categories) {
      categoryList.push(categories[key]);
    }
    categoryList.sort((cA, cB) => cA.order - cB.order);

    return (
      <div>
        <Header />

        <CategoryList category={category} categories={categoryList} />

        <MissionList missions={currentMissions} category={category} categories={categoryList} />
      </div>
    );
  },

  _onChange() {
    this.setState(getMissionState());
  }
});

module.exports = MissionBoard;
