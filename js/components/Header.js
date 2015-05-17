var React = require('react'),
    $ = require('jquery'),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryActions = require('../actions/CategoryActions'),
    CategoryConstants = require('../constants/CategoryConstants'),
    HeaderActions = require('../actions/HeaderActions');

var Header = React.createClass({

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
    $(this.refs.activeFilter.getDOMNode()).html($target.text() + "<i class=\"fa fa-angle-down fa-lg\"></i>");

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
    $(this.refs.activeOrder.getDOMNode()).html($target.text() + "<i class=\"fa fa-angle-down fa-lg\"></i>");

    HeaderActions.orderby({
      by: orderby, 
      type: ordertype
    });
  },

  handleSearch: function(event) {
    HeaderActions.search(event.target.value);
  },

  resetData: function() {
    swal(chrome.i18n.getMessage("resetDataTitle"), chrome.i18n.getMessage("resetDataDone"), "success"); 
    swal({
      title: chrome.i18n.getMessage("resetDataTitle"),
      text: chrome.i18n.getMessage("resetData"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: chrome.i18n.getMessage("modalYes"),
      cancelButtonText: chrome.i18n.getMessage("modalNo"),
      closeOnConfirm: false,
    }, function(isConfirm){
      if (isConfirm) { 
        chrome.storage.sync.clear(function() {
          swal({
            title: chrome.i18n.getMessage("resetDataTitle"), 
            text: chrome.i18n.getMessage("resetDataDone"), 
            type: "success"
          }, function(){
            chrome.runtime.reload();
          }); 
        });
      }
    });
  },

  render: function() {
    return (
      <nav className="navbar navbar-default header">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">
            {chrome.i18n.getMessage("appName")}
          </a>
        </div>
        <form className="navbar-form navbar-left search-form">
          <i className="fa fa-search fa-lg" />
          <input ref="searchInput" type="text" className="form-control search" placeholder={chrome.i18n.getMessage("labelSearch")} onChange={this.handleSearch} />
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
            <li className="navbar-label"><a href="#">{chrome.i18n.getMessage("labelFilterShowing")}</a></li>
            <li className="progress-filter dropdown">
              <a ref="activeFilter" href="#" className="dropdown-toggle" data-toggle="dropdown">{chrome.i18n.getMessage("labelFilterCurrent")}<i className="fa fa-angle-down fa-lg"/></a>
              <ul className="dropdown-menu" role="menu" onClick={this.handleFilter}>
                <li><a href="#" data-filter="all">{chrome.i18n.getMessage("labelFilterAll")}</a></li>
                <li className="active"><a href="#" data-filter="current">{chrome.i18n.getMessage("labelFilterCurrent")}</a></li>
                <li><a href="#" data-filter="completed">{chrome.i18n.getMessage("labelFilterCompleted")}</a></li>
              </ul>
            </li>
            <li className="navbar-label"><a href="#">{chrome.i18n.getMessage("labelMissions")}</a></li>
            <li className="divider"></li>
            <li className="navbar-label"><a href="#">{chrome.i18n.getMessage("labelOrderby")}</a></li>
            <li className="progress-order dropdown">
              <a ref="activeOrder" href="#" className="dropdown-toggle" data-toggle="dropdown">{chrome.i18n.getMessage("labelOrderbyTitle")}<i className="fa fa-angle-down fa-lg"/></a>
              <ul className="dropdown-menu" role="menu" onClick={this.handleOrder}>
                <li className="active"><a href="#" data-orderby="title" data-ordertype="asc"><i className="fa fa-sort-alpha-asc" /> {chrome.i18n.getMessage("labelOrderbyTitle")}</a></li>
                <li><a href="#" data-orderby="title" data-ordertype="desc"><i className="fa fa-sort-alpha-desc" /> {chrome.i18n.getMessage("labelOrderbyTitle")}</a></li>
                <li><a href="#" data-orderby="percent" data-ordertype="asc"><i className="fa fa-sort-amount-asc" /> {chrome.i18n.getMessage("labelOrderbyProgress")}</a></li>
                <li><a href="#" data-orderby="percent" data-ordertype="desc"><i className="fa fa-sort-amount-desc" /> {chrome.i18n.getMessage("labelOrderbyProgress")}</a></li>
                {/*<li><a href="#" data-orderby="createdAt" data-ordertype="asc"><i className="fa fa-sort-numeric-asc" /> {chrome.i18n.getMessage("labelOrderbyDate")}</a></li>
                <li><a href="#" data-orderby="createdAt" data-ordertype="desc"><i className="fa fa-sort-numeric-desc" /> {chrome.i18n.getMessage("labelOrderbyDate")}</a></li>*/}
              </ul>
            </li>
            <li className="divider"></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-cog fa-lg" /> <span className="caret"></span></a>
              <ul className="dropdown-menu" role="menu">
                <li><a href="#" onClick={this.resetData}>{chrome.i18n.getMessage("labelResetData")}</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  },

});

module.exports = Header;
