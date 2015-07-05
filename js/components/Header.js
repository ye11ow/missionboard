var React = require('react'),
    $ = require('jquery'),
    Storage = require('../helpers/Storage'),
    i18n = require("../helpers/I18n"),
    ChromeProxy = require("../helpers/ChromeProxy"),
    CategoryStore = require('../stores/CategoryStore'),
    CategoryActions = require('../actions/CategoryActions'),
    CategoryConstants = require('../constants/CategoryConstants'),
    HeaderActions = require('../actions/HeaderActions');

var Header = React.createClass({

  handleFilter(event) {
    event.preventDefault();
    var filter = $(event.target).attr("data-filter");
    if (filter === undefined) {
      return;
    }

    var $group = $(event.currentTarget),
        $target = $(event.target).parent();

    $group.find(".active").removeClass("active");
    $target.addClass("active");
    $(this.refs.activeFilter.getDOMNode()).html(`${$target.text()}<i class="fa fa-angle-down fa-lg"></i>`);

    HeaderActions.filter(filter);
  },

  handleOrder(event) {
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
    $(this.refs.activeOrder.getDOMNode()).html(`${$target.text()}<i class="fa fa-angle-down fa-lg"></i>`);

    HeaderActions.orderby({
      by: orderby, 
      type: ordertype
    });
  },

  handleSearch(event) {
    HeaderActions.search(event.target.value);
  },

  resetData() {
    swal(i18n.getMessage("resetDataTitle"), i18n.getMessage("resetDataDone"), "success"); 
    swal({
      title: i18n.getMessage("resetDataTitle"),
      text: i18n.getMessage("resetData"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: i18n.getMessage("modalYes"),
      cancelButtonText: i18n.getMessage("modalNo"),
      closeOnConfirm: false,
    }, function(isConfirm){
      if (isConfirm) { 
        Storage.clear(function() {
          swal({
            title: i18n.getMessage("resetDataTitle"), 
            text: i18n.getMessage("resetDataDone"), 
            type: "success"
          }, function(){
            ChromeProxy.reload();
          }); 
        });
      }
    });
  },

  render() {
    return (
      <nav className="navbar navbar-default header">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">
            {i18n.getMessage("appName")}
          </a>
        </div>
        <form className="navbar-form navbar-left search-form">
          <i className="fa fa-search fa-lg" />
          <input ref="searchInput" type="text" className="form-control search" placeholder={i18n.getMessage("labelSearch")} onChange={this.handleSearch} />
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
            <li className="navbar-label"><a href="#">{i18n.getMessage("labelFilterShowing")}</a></li>
            <li className="progress-filter dropdown">
              <a ref="activeFilter" href="#" className="dropdown-toggle" data-toggle="dropdown">{i18n.getMessage("labelFilterCurrent")}<i className="fa fa-angle-down fa-lg"/></a>
              <ul className="dropdown-menu" role="menu" onClick={this.handleFilter}>
                <li><a href="#" data-filter="all">{i18n.getMessage("labelFilterAll")}</a></li>
                <li className="active"><a href="#" data-filter="current">{i18n.getMessage("labelFilterCurrent")}</a></li>
                <li><a href="#" data-filter="completed">{i18n.getMessage("labelFilterCompleted")}</a></li>
              </ul>
            </li>
            <li className="navbar-label"><a href="#">{i18n.getMessage("labelMissions")}</a></li>
            <li className="divider"></li>
            <li className="navbar-label"><a href="#">{i18n.getMessage("labelOrderby")}</a></li>
            <li className="progress-order dropdown">
              <a ref="activeOrder" href="#" className="dropdown-toggle" data-toggle="dropdown">{i18n.getMessage("labelOrderbyTitle")}<i className="fa fa-angle-down fa-lg"/></a>
              <ul className="dropdown-menu" role="menu" onClick={this.handleOrder}>
                <li className="active"><a href="#" data-orderby="title" data-ordertype="asc"><i className="fa fa-sort-alpha-asc" /> {i18n.getMessage("labelOrderbyTitle")}</a></li>
                <li><a href="#" data-orderby="title" data-ordertype="desc"><i className="fa fa-sort-alpha-desc" /> {i18n.getMessage("labelOrderbyTitle")}</a></li>
                <li><a href="#" data-orderby="percent" data-ordertype="asc"><i className="fa fa-sort-amount-asc" /> {i18n.getMessage("labelOrderbyProgress")}</a></li>
                <li><a href="#" data-orderby="percent" data-ordertype="desc"><i className="fa fa-sort-amount-desc" /> {i18n.getMessage("labelOrderbyProgress")}</a></li>
                {/*<li><a href="#" data-orderby="createdAt" data-ordertype="asc"><i className="fa fa-sort-numeric-asc" /> {i18n.getMessage("labelOrderbyDate")}</a></li>
                <li><a href="#" data-orderby="createdAt" data-ordertype="desc"><i className="fa fa-sort-numeric-desc" /> {i18n.getMessage("labelOrderbyDate")}</a></li>*/}
              </ul>
            </li>
            <li className="divider"></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-cog fa-lg" /> <span className="caret"></span></a>
              <ul className="dropdown-menu" role="menu">
                <li><a href="#" onClick={this.resetData}>{i18n.getMessage("labelResetData")}</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  },

});

module.exports = Header;
