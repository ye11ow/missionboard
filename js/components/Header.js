var React = require('react'),
    Storage = require('../helpers/Storage'),
    i18n = require("../helpers/I18n"),
    swal = require("sweetalert"),
    ChromeProxy = require("../helpers/ChromeProxy"),
    HeaderActions = require('../actions/HeaderActions'),
    HeaderConstants = require('../constants/HeaderConstants');

var Header = React.createClass({

  handleFilter(event) {
    event.preventDefault();
    
    var target = event.target,
        ul = event.currentTarget,
        newLi = event.target.parentNode,
        filter = target.dataset.filter;

    if (!target || !filter || !ul || !newLi) {
      return;
    }

    ul.querySelector(".active").classList.remove("active");
    newLi.classList.add("active");
    this.refs.activeFilter.innerHTML = `${newLi.innerText}<i class="fa fa-angle-down fa-lg"></i>`;

    HeaderActions.filter(filter);
  },

  handleOrder(event) {
    event.preventDefault();

    var target = event.target;
    if (!target.dataset.orderby) {
      target = target.parentNode;
    }

    var ul = event.currentTarget,
        newLi = event.target.parentNode,
        orderby = target.dataset.orderby,
        ordertype = target.dataset.ordertype;

    ul.querySelector(".active").classList.remove("active");
    newLi.classList.add("active");
    this.refs.activeOrder.innerHTML = `${newLi.innerText}<i class="fa fa-angle-down fa-lg"></i>`;

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
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              {i18n.getMessage("appName")}
            </a>
          </div>
          <div className="collapse navbar-collapse navbar-inverse-collapse">
            <form className="navbar-form navbar-left search-form">
              <i className="fa fa-search fa-lg" />
              <input ref="searchInput" type="text" className="form-control search" placeholder={i18n.getMessage("labelSearch")} onChange={this.handleSearch} />
            </form>
            <ul className="nav navbar-nav navbar-right">
              <li className="divider"></li>
              <li className="navbar-label"><a href="#">{i18n.getMessage("labelFilterShowing")}</a></li>
              <li className="mission-filter dropdown">
                <a ref="activeFilter" href="#" className="dropdown-toggle" data-toggle="dropdown">{i18n.getMessage("labelFilterCurrent")}<i className="fa fa-angle-down fa-lg"/></a>
                <ul className="dropdown-menu" role="menu" onClick={this.handleFilter}>
                  <li><a href="#" data-filter={HeaderConstants.HEADER_FILTER_ALL}>{i18n.getMessage("labelFilterAll")}</a></li>
                  <li className="active"><a href="#" data-filter={HeaderConstants.HEADER_FILTER_CURRENT}>{i18n.getMessage("labelFilterCurrent")}</a></li>
                  <li><a href="#" data-filter={HeaderConstants.HEADER_FILTER_COMPLETED}>{i18n.getMessage("labelFilterCompleted")}</a></li>
                </ul>
              </li>
              <li className="navbar-label"><a href="#">{i18n.getMessage("labelMissions")}</a></li>
              <li className="divider"></li>
              <li className="navbar-label"><a href="#">{i18n.getMessage("labelOrderby")}</a></li>
              <li className="mission-order dropdown">
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
        </div>
      </nav>
    );
  },

});

module.exports = Header;
