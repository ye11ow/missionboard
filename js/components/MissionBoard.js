var React = require('react'),
    ProgressList = require('./ProgressList'),
    CategoryList = require('./CategoryList'),
    ProgressActions = require('../actions/ProgressActions'),
    ProgressStore = require('../stores/ProgressStore'),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryActions = require('../actions/CategoryActions'),
    CategoryConstants = require('../constants/CategoryConstants'),
    introguide = require('../helpers/Introguide');

function getProgressState() {
  return {
    progresses: ProgressStore.getAll(),
    categories: CategoryStore.getAll(),
    category: $("#main-menu").find(".active").attr("data-category"),
  };
}

function init() {
  var ids = CategoryStore.init();
  ProgressStore.init(ids);

  setTimeout(function() {
    introguide.startIntro();
  }, 400);
}

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

function processFilter(filter) {
  if (filter === "all") {
    $('[data-role="progress"]').show();
  } else if (filter === "current") {
    $('[data-role="progress"][data-completed="false"]').show();
    $('[data-role="progress"][data-completed="true"]').hide();
  } else {
    $('[data-role="progress"][data-completed="true"]').show();
    $('[data-role="progress"][data-completed="false"]').hide();
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
        init.call(this);
      }
    });
  },

  componentWillUnmount: function() {
    ProgressStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function() {
    var filter = $("#progress-filter").find(".active a").attr("data-filter");
    processFilter(filter);
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

  handleFilter: function(event) {
    event.preventDefault();
    var filter = $(event.target).attr("data-filter");
    if (filter === undefined) {
      return;
    }

    var $group = $(event.currentTarget);
    $group.find(".active").removeClass("active");
    var $target = $(event.target).parent();
    $target.addClass("active");

    $(this.refs.activeFilter.getDOMNode()).text($target.text());

    processFilter(filter);
  },

  handleOrder: function(event) {
    event.preventDefault();

    var $target = $(event.target);
    if (!$target.attr("data-orderby")) {
      $target = $target.parent();
    }

    var orderby = $target.attr("data-orderby"),
        ordertype = $target.attr("data-ordertype"),
        $group = $(event.currentTarget);

    $group.find(".active").removeClass("active");
    $target.parent().addClass("active");

    $(this.refs.activeOrder.getDOMNode()).text($target.text());

    if (orderby && ordertype) {
       CategoryActions.updateOrderby(this.state.category, orderby, ordertype); 
    }
  },

  resetData: function() {
    swal({
      title: "Reset Data",
      text: "Do you really want to reset all data?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      closeOnConfirm: false,
    }, function(isConfirm){
      if (isConfirm) { 
        chrome.storage.sync.remove('_inited');
        chrome.storage.sync.remove('_cateogries');
        chrome.storage.sync.remove('_progresses');
        swal("Resetted!", "Please re-launch the MissionBoard.", "success"); 
      }
    });
  },

  render: function() {
    var progresses = this.state.progresses,
        categories = this.state.categories,
        _progresses = {},
        category = null,
        orderby = null;

    if (this.state.category) {
      category = categories[this.state.category];
      orderby = category.orderby;
      $(this.refs.activeOrder.getDOMNode()).text($("[data-orderby='" + orderby.by + "']").eq(0).text());
    } else {
      orderby = {
        type: "desc",
        by: "title"
      }
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
                <span id="sync-status"></span>
              </a>
            </div>
             <div className="navbar-collapse collapse navbar-inverse-collapse">
             
              {/*<ul className="nav navbar-nav">
                <li id="progress-count" className="navbar-value"></li>
                <li className="navbar-title">Missions</li>
                <li id="overall-progress" className="navbar-value"></li>
                <li className="navbar-title">Overall Progress</li>
              </ul>*/}
              
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <li><a href="#">Showing</a></li>
                </li>
                <li id="progress-filter" className="dropdown">
                  <a ref="activeFilter" href="#" className="dropdown-toggle" data-toggle="dropdown">Active</a>
                  <ul className="dropdown-menu" role="menu" onClick={this.handleFilter}>
                    <li><a href="#" data-filter="all">All</a></li>
                    <li className="active"><a href="#" data-filter="current">Active</a></li>
                    <li><a href="#" data-filter="completed">Completed</a></li>
                  </ul>
                </li>
                <li>
                  <li><a href="#">Missions</a></li>
                </li>
                <li>
                  <li><a href="#">Order by</a></li>
                </li>
                <li id="progress-order" className="dropdown">
                  <a ref="activeOrder" href="#" className="dropdown-toggle" data-toggle="dropdown">Progress</a>
                  <ul className="dropdown-menu" role="menu" onClick={this.handleOrder}>
                    <li className="active"><a href="#" data-orderby="title" data-ordertype="asc"><i className="fa fa-sort-alpha-asc"></i> Title</a></li>
                    <li><a href="#" data-orderby="title" data-ordertype="desc"><i className="fa fa-sort-alpha-desc"></i> Title</a></li>
                    <li><a href="#" data-orderby="percent" data-ordertype="asc"><i className="fa fa-sort-amount-asc"></i> Progress</a></li>
                    <li><a href="#" data-orderby="percent" data-ordertype="desc"><i className="fa fa-sort-amount-desc"></i> Progress</a></li>
                    <li><a href="#" data-orderby="createdAt" data-ordertype="asc"><i className="fa fa-sort-numeric-asc"></i> Date</a></li>
                    <li><a href="#" data-orderby="createdAt" data-ordertype="desc"><i className="fa fa-sort-numeric-desc"></i> Date</a></li>
                  </ul>
                </li>
                <li className="divider">
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">Settings <span className="caret"></span></a>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#" onClick={this.resetData}>Reset Data</a></li>
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
