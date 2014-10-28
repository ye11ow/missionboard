 /**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var ProgressActions = require('../actions/ProgressActions');
var CategoryActions = require('../actions/CategoryActions');

var Progress = require('./Progress');

function validate($title, $current, $total) {
  var title = $title.val();
  var current = parseInt($current.val());
  var total = parseInt($total.val());
  if (!title || title.length == 0) {
    $title.css("box-shadow", "inset 0 -2px 0 #e51c23");
    return false;
  }
  if (isNaN(current)) {
    $current.css("box-shadow", "inset 0 -2px 0 #e51c23");
    $current.val("");
    $current.attr("placeholder","number here");
    return false;
  }
  if (isNaN(total)) {
    $total.css("box-shadow", "inset 0 -2px 0 #e51c23");
    $total.val("");
    $total.attr("placeholder","number here");
    return false;
  }

  return true;
}

// TODO optimize
function getSorting(order) {
  var key = order.by;
  if (order.type === "asc") {
    return function (pA, pB) {
      if (typeof pA[key] === "string") {
        return pA[key].localeCompare(pB[key]);
      } else {
        return pA[key] - pB[key];
      }
    }
  } else {
    return function (pA, pB) {
      if (typeof pA[key] === "string") {
        return pB[key].localeCompare(pA[key]);
      } else {
        return pB[key] - pA[key];
      }
    }
  }
}

function getOrderby() {
  return {
    by: $("#progress-orderby").val(),
    type: $("#progress-ordertype").hasClass("glyphicon-arrow-up") ? "asc" : "desc"
  }
}

function getOverallProgress(progresses) {
  var sum = 0;
  var count = 0;
  for (var i in progresses) {
    sum += progresses[i].current * 100 / progresses[i].total;
    count++;
  }

  return Math.floor(sum / count);
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

var ProgressList = React.createClass({

  propTypes: {
    progresses: ReactPropTypes.object.isRequired
  },

  componentDidMount: function() {
    $('#complete-progress').easyPieChart({
      size: 120,
      onStep: function(from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent));
      }
    });
    $('#complete-progress').data('easyPieChart').update(0);
    $('#overall-progress').easyPieChart({
      size: 120,
      onStep: function(from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent));
      }
    });
    $('#overall-progress').data('easyPieChart').update(0);
  },

  componentDidUpdate: function() {
    var filter = $("#progress-filter").find(".active a").attr("data-filter");
    processFilter(filter);
  },

  getInitialState: function () {
    return {
      count: this.props.progresses.count
    };
  },

  handlePreAdd: function(event) {
    if (event.which === 13) {
      var $input = $(event.target);
      var title = $input.val();
      if (typeof title === "string" && title.length > 0) {
        $("#progress-edit-title").val(title);

        $("#progress-edit").modal("show");
        $("#progress-edit").attr("data-role", "add");
        $("#progress-edit").find(".modal-title").text("Add a new item");
        $("#progress-edit-save").text("Add");
      }

      $input.val("");
    }
  },

  handleSave:function () {
    if (validate($("#progress-edit-title"), $("#progress-edit-current"), $("#progress-edit-total"))) {
      if ($("#progress-edit").attr("data-role") === "add") {
        ProgressActions.create(
          $("#progress-edit-title").val(), 
          parseInt($("#progress-edit-current").val()), 
          parseInt($("#progress-edit-total").val()),
          $("#progress-edit-category").val(),
          null,
          $("#progress-edit-description").val()
        );
      } else if ($("#progress-edit").attr("data-role") === "edit") {
        ProgressActions.update(
          $("#progress-edit").attr("data-id"),
          $("#progress-edit-title").val(), 
          parseInt($("#progress-edit-current").val()), 
          parseInt($("#progress-edit-total").val()),
          $("#progress-edit-category").val(),
          null,
          $("#progress-edit-description").val()
        );
      }

      $("#progress-edit-form").trigger('reset');
      this.handleCancel();
    }
  },

  handleCancel: function() {
    $("#progress-edit").modal("hide");
  },

  handleOrderby: function() {
    var orderby = getOrderby();

    CategoryActions.updateOrderby(this.props.category.id, orderby.by, orderby.type);
  },

  handleOrdertype: function() {
    var $target = $(event.target);

    if ($target.hasClass("glyphicon-arrow-up")) {
      $target.removeClass("glyphicon-arrow-up");
      $target.addClass("glyphicon-arrow-down");
    } else {
      $target.removeClass("glyphicon-arrow-down");
      $target.addClass("glyphicon-arrow-up");
    }

    var orderby = getOrderby();

    CategoryActions.updateOrderby(this.props.category.id, orderby.by, orderby.type);
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

    processFilter(filter);
  },

  render: function() {
    var self = this;
    var progresses = this.props.progresses;
    var progressItems = [];
    var _progresses = [];
    var completed = 0;
    var categories = [];
    var orderby = getOrderby();
    if (this.props.category) {
      $('select option[value="' + this.props.category.id + '"]').attr("selected", true);
      orderby = this.props.category.orderby;
    }

    $('select option[value="' + orderby.by + '"]').attr("selected", true);

    for (var i in this.props.categories) {
      categories.push(this.props.categories[i]);
    }

    // a key is need here for Progress.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in progresses) {
      if (progresses[key].completed === true) {
        completed++;
      }

      _progresses.push(progresses[key]);
    }

    var sortProgress = getSorting(orderby);
    _progresses.sort(sortProgress);

    _progresses.forEach(function(p) {
      progressItems.push(<Progress key={p.id} progress={p} />);
    });

    if ($('#complete-progress').data('easyPieChart')) {
      var length = _progresses.length;
      if (length === 0) {
        $('#complete-progress').data('easyPieChart').update(0);
      } else {
        $('#complete-progress').data('easyPieChart').update(Math.floor(completed * 100 / _progresses.length));
      }
    }
    if ($('#overall-progress').data('easyPieChart')) {
      if (length === 0) {
        $('#overall-progress').data('easyPieChart').update(0);
      } else {
        $('#overall-progress').data('easyPieChart').update(getOverallProgress(progresses));
      }
    }

    return (
      <div className="container-fluid main-container">
        <div className="row progress-dashboard">
          <div className="col-lg-6">
            <div className="panel panel-default">
              <div className="panel-body row">
                <div className="col-md-6 col-left">
                  <h3>Total Items</h3>
                  <div className="alert alert-info alert-state">{_progresses.length}</div>
                </div>
                <div className="col-md-6">
                  <h3>Completed Items</h3>
                  <div className="alert alert-success alert-state">{completed}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>Completed Progress</h3>
                <div id="complete-progress" className="progress-chart">
                  <span className="percent"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>Overall Progress</h3>
                <div id="overall-progress" className="progress-chart">
                  <span className="percent"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="progress-edit" className="modal fade" tabindex="-1" data-role="add">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Add a new item</h4>
              </div>
              <div className="modal-body">
                <form id="progress-edit-form" className="form-horizontal">
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Title</label>
                    <div className="col-sm-10">
                      <input id="progress-edit-title" type="text" className="form-control" placeholder="Gundam Seed" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="progress-current col-sm-5 form-group">
                      <label className="control-label">Current Progress</label>
                      <div className="">
                        <input id="progress-edit-current" type="number" className="form-control" placeholder="0"/>
                      </div>
                    </div>
                    <div className="progress-total form-group col-sm-5">
                      <label className="control-label">Total Progress</label>
                      <div className="">
                        <input id="progress-edit-total" type="number" className="form-control" placeholder="48"/>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Category</label>
                    <div className="col-sm-10">
                      <select id="progress-edit-category" className="form-control">
                        {categories.map(function(category) {
                          return <option key={category.id} value={category.id}>{category.title}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Description</label>
                    <div className="col-sm-10">
                      <textarea id="progress-edit-description" className="form-control" rows="5"></textarea>
                      <span className="help-block">Markdown supported</span>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button id="progress-edit-save" type="button" className="btn btn-primary" onClick={this.handleSave}>Add</button>
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.handleCancel}>Close</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel panel-default progress-toolbar">
          <div className="panel-body">
            <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <input type="text" className="form-control" onKeyPress={this.handlePreAdd} placeholder="create a new mission" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="progress-filter">
                <label>items</label>
                <ul id="progress-filter" className="nav nav-tabs" onClick={this.handleFilter}>
                  <li><a href="#" data-filter="all">All</a></li>
                  <li className="active"><a href="#" data-filter="current">Current</a></li>
                  <li><a href="#" data-filter="completed">Completed</a></li>
                </ul>
                <label>Showing</label>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="progress-orderby">
                <label for="progress-orderby">Order By</label>
                <select id="progress-orderby" onChange={this.handleOrderby}>
                  <option value="title">Title</option>
                  <option value="createdAt">Date</option>
                </select>
                <span id="progress-ordertype" className="glyphicon glyphicon glyphicon-arrow-up" onClick={this.handleOrdertype}></span>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div id="progress-list">
          {progressItems}
        </div>
      </div>  
    );
  },

});

module.exports = ProgressList;
