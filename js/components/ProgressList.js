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

function getOverallProgress(progresses) {
  var sum = 0;
  var count = 0;
  for (var i in progresses) {
    sum += progresses[i].percent;
    count++;
  }

  if (count === 0) {
    return 0;
  }

  return Math.floor(sum / count);
}

var ProgressList = React.createClass({

  propTypes: {
    progresses: ReactPropTypes.object.isRequired
  },

  componentDidMount: function() {
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
      var title = $("#progress-edit-title").val(),
          current = parseInt($("#progress-edit-current").val()),
          total = parseInt($("#progress-edit-total").val()),
          category = $("#progress-edit-category").val(),
          description = $("#progress-edit-description").val();

      if ($("#progress-edit").attr("data-role") === "add") {
        ProgressActions.create(title, current, total, category, null, description);
      } else if ($("#progress-edit").attr("data-role") === "edit") {
        ProgressActions.update($("#progress-edit").attr("data-id"),
          title, current, total, category, null, description);
      }

      $("#progress-edit-form").trigger('reset');
      this.handleCancel();
    }
  },

  handleCancel: function() {
    $("#progress-edit").modal("hide");
  },

  render: function() {
    var self = this,
        progresses = this.props.progresses,
        progressItems = [],
        _progresses = [],
        completed = 0,
        categories = [],
        orderby = null;

    if (this.props.category) {
      $('select option[value="' + this.props.category.id + '"]').attr("selected", true);
      orderby = this.props.category.orderby;

      for (var i in this.props.categories) {
        categories.push(this.props.categories[i]);
      }

      // a key is need here for Progress.
      // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
      for (var key in progresses) {
        var progress = progresses[key];
        if (progress.completed === true) {
          completed++;
        }

        progress.percent = progress.current * 100 / progress.total; 

        _progresses.push(progress);
      }

      var sortProgress = getSorting(orderby);
      _progresses.sort(sortProgress);

      _progresses.forEach(function(p) {
        progressItems.push(<Progress key={p.id} progress={p} />);
      });

      $("#progress-count").text(Object.keys(_progresses).length);
      $("#overall-progress").text(getOverallProgress(progresses) + "%");
    } else {
      orderby = {
        by: "title",
        type: "asc"
      }
    }

    return (
      <div className="container-fluid main-container">
        <div id="progress-edit" className="modal fade" tabIndex="-1" data-role="add">
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
                          if (!category.system) {
                            return <option key={category.id} value={category.id}>{category.title}</option>;
                          }
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
            <div className="col-lg-10">
              <div className="form-group">
                <input type="text" className="form-control" onKeyPress={this.handlePreAdd} placeholder="create a new mission" />
              </div>
            </div>
            <div className="col-lg-2">
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
