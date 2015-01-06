var React = require('react');
var ProgressList = require('./ProgressList');
var CategoryList = require('./CategoryList');
var ProgressActions = require('../actions/ProgressActions');
var ProgressStore = require('../stores/ProgressStore');

var CategoryStore = require('../stores/CategoryStore');
var CategoryActions = require('../actions/CategoryActions');
var CategoryConstants = require('../constants/CategoryConstants');

function getProgressState() {
  return {
    progresses: ProgressStore.getAll(),
    categories: CategoryStore.getAll(),
    category: $("#main-menu").find(".active").attr("data-category"),
  };
}

function init() {
  var vId = CategoryActions.create("Videos", 1);
  var bId = CategoryActions.create("Books", 2);
  var oId = CategoryActions.create("Others", 3);

  /*
  ProgressActions.create(
    "My Favorite Anime", 
    0, 
    12,
    vId,
    null,
    "This is my favorite anime"
  );

  ProgressActions.create(
    "My Favorite Book", 
    0, 
    600,
    bId,
    null,
    "This is my favorite book"
  );

  ProgressActions.create(
    "Learn Mission Board", 
    0, 
    10,
    oId,
    null,
    "Learn some basic usage of Mission Board"
  );
  ProgressStore.persist();
  */

  //this.startTour();

  var state = getProgressState();
  state["category"] = CategoryConstants.CATEGORY_ALLID;

  this.setState(state);
}

function calcCategoryCount(categories, progresses) {
  var allId = null;
  for (var key in categories) {
    var category = categories[key];
    category.count = 0;
    if (category.system) {
      allId = key;
    }
  }

  for (var key in progresses) {
    var category = categories[progresses[key].category];
    if (!progresses[key].completed) {
      category.count++;
      categories[allId].count++;
    }
  }
}

var MissionBoard = React.createClass({

  getInitialState: function() {
    return getProgressState();
  },

  componentDidMount: function() {
    var self = this;
    ProgressStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);

    chrome.storage.sync.get('_inited', function(inited){
      if ('_inited' in inited && inited['_inited'] === true) {
        chrome.storage.sync.get(['_categories', '_progresses'], function(data){
          // promise here
          CategoryStore.loadCategories(data._categories);
          ProgressStore.loadProgresses(data._progresses);

          var state = getProgressState();
          state["category"] = CategoryConstants.CATEGORY_ALLID;

          self.setState(state);
        });
      } else {
        chrome.storage.sync.set({'_inited': true}); 
        //chrome.storage.sync.remove('_inited'); 
        init.call(this);
      }
    });
  },

  componentWillUnmount: function() {
    ProgressStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
  },

  startTour: function() {
    console.log("EnjoyHint is not available");
    /*
    var ehint = new EnjoyHint({});
    var ehintSteps = [
      {
        selector: '#progress-list',
        event: 'click',
        description: 'List of all your missions',
        event_type: "next"
      },
      {
        selector: '.progress-toolbar input[type="text"]',
        event: 'click',
        description: 'Create a new mission by entering its title here',
        event_type: "next"
      },
      {
        selector: '.progress-filter',
        event: 'click',
        description: 'Filter missions',
        event_type: "next"
      },
      {
        selector: '.progress-orderby',
        event: 'click',
        description: 'Sort missions',
        event_type: "next"
      },
      {
        selector: '.nav.nav-pills.nav-stacked',
        event: 'click',
        description: 'All categories',
        event_type: "next"
      }, 
      {
        selector: '.category-dashboard',
        event: 'click',
        description: 'Add/Edit category',
        event_type: "next"
      }
    ];

    ehint.setScript(ehintSteps);
    ehint.runScript();
    */
  },

  handleCategorySwitch: function(id) {
    this.setState({category: id});
  },

  handleCategoryDestroy: function(id) {
    if (id === this.state.category) {
      $("#main-menu > ul li:first-child").addClass("active");
    }
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
    var progresses = this.state.progresses;
    var categories = this.state.categories;
    var _progresses = {};
    var category = null;
    var syncIcon = "glyphicon glyphicon-ok-sign";

    if (this.state.category) {
      category = categories[this.state.category];
    }

    // a key is need here for Progress.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in progresses) {
      if (!category || progresses[key].category === category.id || category.system === true) {
        _progresses[key] = progresses[key];
      }
    }

    calcCategoryCount(categories, progresses);

    return (
      <div>

        <nav className="navbar navbar-default banner">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">
                MissionBoard
                <span id="sync-status" className={syncIcon}></span>
              </a>
            </div>
             <div className="navbar-collapse collapse navbar-inverse-collapse">
              <ul className="nav navbar-nav">
                <li id="progress-count" className="navbar-value"></li>
                <li className="navbar-title">Missions</li>
                <li id="overall-progress" className="navbar-value"></li>
                <li className="navbar-title">Overall Progress</li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#" onClick={this.startTour}>Start Tour</a></li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">User <span className="caret"></span></a>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#">Perference</a></li>
                    <li className="divider"></li>
                    <li><a href="#">Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
        </nav>

        <CategoryList category={category} categories={this.state.categories}
          onCategorySwitch={this.handleCategorySwitch}
          onCategoryCreate={this.handleCategoryCreate}
          onCategoryDestroy={this.handleCategoryDestroy} />

        <ProgressList progresses={_progresses} category={category} categories={this.state.categories} />

      </div>
    );
  },

  _onChange: function() {
    this.setState(getProgressState());
  }
});

module.exports = MissionBoard;
