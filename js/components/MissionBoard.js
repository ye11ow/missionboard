var React = require('react');
var ProgressList = require('./ProgressList');
var CategoryList = require('./CategoryList');
var ProgressStore = require('../stores/ProgressStore');

var CategoryStore = require('../stores/CategoryStore');
var CategoryActions = require('../actions/CategoryActions');

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
    return {};
  },

  componentDidMount: function() {
    ProgressStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);

    $.when( 
      $.get(SERVER + "/missions/"),
      $.get(SERVER + "/categories/") 
    ).done(function(progresses, categories){
      if (progresses[0]) {
        progresses = progresses[0];
      }
      if (categories[0]) {
        categories = categories[0];
      }

      var _progresses = {};
      var _categories = {}

      $.each(progresses, function(i, d) {
        d.id = d["_id"]["$oid"];
        delete d["_id"];
        _progresses[d.id] = d;
        length++;
      });

      var categoryId = null;

      $.each(categories, function(i, d) {
        d.id = d["_id"]["$oid"];
        delete d["_id"];
        delete d.orderby["_id"];
        _categories[d.id] = d;
        if (d.system === true) {
          categoryId = d.id;
        }
      });

      if (this.isMounted()) {
        ProgressStore.setProgresses(_progresses, length);
        CategoryStore.setCategories(_categories);

        var state = getProgressState();
        state["category"] = categoryId;
        this.setState(state);
      }

    }.bind(this));
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
    CategoryActions.destroy(id);
  },

  handleCategoryCreate: function(category) {
    // no set state here, the setState will be triggered by changeListener.
    CategoryActions.create(category.title, category.order);
  },

  render: function() {
    var progresses = this.state.progresses;
    var _progresses = {};
    var category = null;

    if (this.state.category) {
      category = this.state.categories[this.state.category];
    }

    // a key is need here for Progress.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in progresses) {
      if (!category || progresses[key].category === category.id || category.system === true) {
        _progresses[key] = progresses[key];
      }
    }

    return (
      <div>

        <nav className="navbar navbar-default banner">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">MissionBoard</a>
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
