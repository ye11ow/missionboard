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
    length: ProgressStore.getLength(),
    categories: CategoryStore.getAll(),
    syncs: {
      categories: CategoryStore.getSyncs(),
      progresses: ProgressStore.getSyncs()
    },
    category: $("#main-menu").find(".active").attr("data-category"),
  };
}

function processRawData(categories, progresses) {
  if (this.isMounted()) {
    ProgressStore.setProgresses(progresses);
    CategoryStore.setCategories(categories);

    // First time initilization
    if (localStorage["inited"] !== "true") {
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

      CategoryStore.persist();
      localStorage["inited"] = "true";
    }

    var state = getProgressState();
    state["category"] = CategoryConstants.CATEGORY_ALLID;

    var progresses = state.progresses;
    var categories = state.categories;

    this.setState(state);
  }
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
    return {};
  },

  componentDidMount: function() {
    ProgressStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);

    if (SERVER) {
      $.when( 
        $.get(SERVER + "/missions/"),
        $.get(SERVER + "/categories/")
      ).done(function(progresses, categories) {
        if (progresses[0]) {
          progresses = progresses[0];
        }
        if (categories[0]) {
          categories = categories[0];
        }

        var _progresses = {};
        var _categories = {}
        $.each(progresses, function(i, d) {
          // to be deleted
          if (d["_id"]["$oid"]) {
            d.id = d["_id"]["$oid"];
          } else {
            d.id = d["_id"];
          }
          delete d["_id"];
          _progresses[d.id] = d;
          length++;
        });

        var categoryId = null;

        $.each(categories, function(i, d) {
          d.id = d["_id"];
          delete d["_id"];
          delete d.orderby["_id"];
          _categories[d.id] = d;
          if (d.system === true) {
            categoryId = d.id;
          }
        });
        processRawData.call(this, _categories, _progresses);
      }.bind(this));
    } else {
      processRawData.call(this, {}, {});
    }

  },

  componentWillUnmount: function() {
    ProgressStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
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
    var syncs = this.state.syncs;
    var syncStatus = "";
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

    if (syncs) {
      for (var key in syncs.categories) {
        syncStatus += key + ";"
        syncIcon = "glyphicon glyphicon-warning-sign";
      }
      for (var key in syncs.progresses) {
        syncStatus += key + ";"
        syncIcon = "glyphicon glyphicon-warning-sign";
      }
      CategoryStore.persist();
      ProgressStore.persist();
    }

    if (SERVER === "") {
      syncIcon += " hidden";
    }

    return (
      <div>

        <nav className="navbar navbar-default banner">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">
                MissionBoard
                <span id="sync-status" className={syncIcon} title={syncStatus}></span>
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
                <li><a href="#">Start Tour</a></li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">ye11ow <span className="caret"></span></a>
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
