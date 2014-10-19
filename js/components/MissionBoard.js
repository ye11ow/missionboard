 /**
 * @jsx React.DOM
 */
var React = require('react');
var ProgressList = require('./ProgressList');
var ProgressStore = require('../stores/ProgressStore');
var ProgressActions = require('../actions/ProgressActions');

var CategoryStore = require('../stores/CategoryStore');

function getProgressState() {
  return {
    progresses: ProgressStore.getAll(),
    length: ProgressStore.getLength(),
    categories: CategoryStore.getAll(),
    category: $("#main-menu").find(".active").attr("data-category"),
  };
}

var MissionBoard = React.createClass({

  getInitialState: function() {
    return getProgressState();
  },

  componentDidMount: function() {
    ProgressStore.addChangeListener(this._onChange);

    $.get( SERVER + "/missions/", function(data) {
      var data = JSON.parse(data);
      var progresses = {};
      var length = 0;
      $.each(data, function(i, d) {
        d.id = d["_id"]["$oid"];
        delete d["_id"];
        progresses[d.id] = d;
        length++;
      });
      if (this.isMounted()) {
        ProgressStore.setProgresses(progresses, length);
        this.setState(getProgressState());
      }
    }.bind(this));

    $.get( SERVER + "/categories/", function(data) {
      var data = JSON.parse(data);
      var categories = {};
      $.each(data, function(i, d) {
        d.id = d["_id"]["$oid"];
        delete d["_id"];
        categories[d.id] = d;
      });

      if (this.isMounted()) {
        CategoryStore.setCategories(categories);
        this.setState(getProgressState());
      }
    }.bind(this));
  },

  componentWillUnmount: function() {
    ProgressStore.removeChangeListener(this._onChange);
  },

  handleSwitchCategory: function(event) {
    var newCategory = $(event.target).parent().attr("data-category");
    if (newCategory === undefined || newCategory === this.state.category) {
      return;
    }

    var $category = $(event.currentTarget);
    $category.find(".active").removeClass("active");
    var $target = $(event.target).parent();
    $target.addClass("active");

    this.setState(getProgressState());
  },

  render: function() {
    var progresses = this.state.progresses;
    var _progresses = {};
    var categories = [];
    var category = this.state.category;

    for (var i in this.state.categories) {
      categories.push(this.state.categories[i]);
    }

    // a key is need here for Progress.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in progresses) {
      if (category === "all" || progresses[key].category === category) {
        _progresses[key] = progresses[key];
      }
    }

    return (
      <div>
        <nav className="navbar navbar-default banner">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">MissionBoard</a>
            </div>
            <div className="collapse navbar-collapse">
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
          </div>
        </nav>
        <div id="main-menu" className="main-menu" onClick={this.handleSwitchCategory}>
          <ul className="nav nav-pills nav-stacked">
            <li className="active" data-category="all"><a href="#">All</a></li>
            {categories.map(function(category) {
              return <li key={category.id} data-category={category.id}><a href="#">{category.title}</a></li>;
            })}
          </ul>
        </div>
        <ProgressList progresses={_progresses} category={this.state.category} categories={this.state.categories} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getProgressState());
  }
});

module.exports = MissionBoard;
