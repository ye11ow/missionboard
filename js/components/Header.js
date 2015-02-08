var React = require('react'),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryActions = require('../actions/CategoryActions'),
    CategoryConstants = require('../constants/CategoryConstants'),
    HeaderActions = require('../actions/HeaderActions');


var Header = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
  },

  componentDidUpdate: function() {
    //$(this.refs.activeOrder.getDOMNode()).text($("[data-orderby='" + this.state.orderby.by + "']").eq(0).text());
  },

  handleFilter: function(event) {
    event.preventDefault();
    var filter = $(event.target).attr("data-filter");
    if (filter === undefined) {
      return;
    }

    var $group = $(event.currentTarget),
        $target = $(event.target).parent();

    $group.find(".active").removeClass("active");
    $target.addClass("active");
    $(this.refs.activeFilter.getDOMNode()).text($target.text());

    HeaderActions.filter(filter);
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

    HeaderActions.orderby({
      by: orderby, 
      type: ordertype
    });
  },

  handleSearch: function(event) {
    HeaderActions.search(event.target.value);
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
    var search = this.state.search;

    return (
      <nav className="navbar navbar-default banner">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">
            MissionBoard
            <span id="sync-status"></span>
          </a>
        </div>
        <form className="navbar-form navbar-left search-form">
          <i className="fa fa-search fa-lg" />
          <input ref="searchInput" type="text" className="form-control search" placeholder="Search" onChange={this.handleSearch} />
        </form>
        <div className="navbar-collapse collapse navbar-inverse-collapse">
         
          {/*<ul className="nav navbar-nav">
            <li id="progress-count" className="navbar-value"></li>
            <li className="navbar-title">Missions</li>
            <li id="overall-progress" className="navbar-value"></li>
            <li className="navbar-title">Overall Progress</li>
          </ul>*/}
          
          <ul className="nav navbar-nav navbar-right">
            <li className="divider"></li>
            <li className="navbar-label"><a href="#">Showing</a></li>
            <li id="progress-filter" className="dropdown">
              <a ref="activeFilter" href="#" className="dropdown-toggle" data-toggle="dropdown">Active</a>
              <ul className="dropdown-menu" role="menu" onClick={this.handleFilter}>
                <li><a href="#" data-filter="all">All</a></li>
                <li className="active"><a href="#" data-filter="current">Active</a></li>
                <li><a href="#" data-filter="completed">Completed</a></li>
              </ul>
            </li>
            <li className="navbar-label"><a href="#">Missions</a></li>
            <li className="divider"></li>
            <li className="navbar-label"><a href="#">Order by</a></li>
            <li id="progress-order" className="dropdown">
              <a ref="activeOrder" href="#" className="dropdown-toggle" data-toggle="dropdown">Title</a>
              <ul className="dropdown-menu" role="menu" onClick={this.handleOrder}>
                <li className="active"><a href="#" data-orderby="title" data-ordertype="asc"><i className="fa fa-sort-alpha-asc" /> Title</a></li>
                <li><a href="#" data-orderby="title" data-ordertype="desc"><i className="fa fa-sort-alpha-desc" /> Title</a></li>
                <li><a href="#" data-orderby="percent" data-ordertype="asc"><i className="fa fa-sort-amount-asc" /> Progress</a></li>
                <li><a href="#" data-orderby="percent" data-ordertype="desc"><i className="fa fa-sort-amount-desc" /> Progress</a></li>
                <li><a href="#" data-orderby="createdAt" data-ordertype="asc"><i className="fa fa-sort-numeric-asc" /> Date</a></li>
                <li><a href="#" data-orderby="createdAt" data-ordertype="desc"><i className="fa fa-sort-numeric-desc" /> Date</a></li>
              </ul>
            </li>
            <li className="divider"></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">Settings <span className="caret"></span></a>
              <ul className="dropdown-menu" role="menu">
                <li><a href="#" onClick={this.resetData}>Reset Data</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  },

});

module.exports = Header;
