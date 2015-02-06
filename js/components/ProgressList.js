var React = require('react'),
    ProgressActions = require('../actions/ProgressActions'),
    CategoryActions = require('../actions/CategoryActions'),
    HeaderStore = require('../stores/HeaderStore');

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

  componentDidMount: function() {
    HeaderStore.addChangeListener(this._onChange);

    $("#progress-edit").on('shown.bs.modal', function () {
      $("#progress-edit-current").focus();
    });
  },

  componentWillUnmount: function() {
    HeaderStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return {
      //count: this.props.progresses.count,
      keyword: HeaderStore.getKeyword(),
      filter: HeaderStore.getFilter(),
      orderby: HeaderStore.getOrderby()
    };
  },

  handleFocus: function() {
    $(this.refs.progressTip.getDOMNode()).text("Input the title and press Enter...");
    //$(this.refs.createBtn.getDOMNode()).show();
  },

  handleBlur: function() {
    var $input = $(this.refs.progressTitle.getDOMNode()),
        title = $input.val();

    if (title && title.length > 0) {
      $input.parent().addClass("input--filled");
    } else {
      $input.parent().removeClass("input--filled");
      //$(this.refs.createBtn.getDOMNode()).hide(300);
      $(this.refs.progressTip.getDOMNode()).text("Create a new mission from here...");
    }
  },

  handlePreAdd: function(event) {
    if (event.which === 13) {

      // "ENTER" pressed
      var $input = $(this.refs.progressTitle.getDOMNode());
      var title = $input.val();
      if (typeof title === "string" && title.length > 0) {
        $("#progress-edit-form").trigger('reset');

        $("#progress-edit-title").val(title);

        $("#progress-edit").modal("show");
        $("#progress-edit").attr("data-role", "add");
        $("#progress-edit").find(".modal-title").text("Add a new item");
        $("#progress-edit-save").text("Add");
      }

      $input.val("");
    } else if (event.which === 27) {

      // "ESC" pressed
      var $input = $(this.refs.progressTitle.getDOMNode());
      $input.val("").blur();
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
        categories = [],
        orderby = this.state.orderby,
        keyword = this.state.keyword,
        filter = this.state.filter;

    if (this.props.category) {
      $('select option[value="' + this.props.category.id + '"]').attr("selected", true);

      for (var i in this.props.categories) {
        categories.push(this.props.categories[i]);
      }

      // a key is need here for Progress.
      // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
      for (var key in progresses) {
        var progress = progresses[key];

        if (keyword.length > 0) {
          if (progress.title.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            continue;
          }
        }

        if (filter === "current" && progress.completed) {
          continue;
        }
        if (filter === "completed" && !progress.completed) {
          continue;
        }

        progress.percent = progress.current * 100 / progress.total; 

        _progresses.push(progress);
      }

      var sortProgress = getSorting(orderby);
      _progresses.sort(sortProgress);

      _progresses.forEach(function(p) {
        progressItems.push(<Progress key={p.id} progress={p} />);
      });

      //$("#progress-count").text(Object.keys(_progresses).length);
      //$("#overall-progress").text(getOverallProgress(progresses) + "%");
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

        <div className="progress-toolbar">
          <div className="row">
            <div className="col-lg-7 col-lg-offset-2">
              <span className="input input--hoshi">
              <input ref="progressTitle" type="text" className="input__field input__field--hoshi" onKeyDown={this.handlePreAdd} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <label className="input__label input__label--hoshi input__label--hoshi-color-1">
                  <span ref="progressTip" className="input__label-content input__label-content--hoshi">Create a new mission from here...</span>
                </label>
              </span>
              {/*<a href="#" ref="createBtn" className="btn btn-primary create-progress" onClick={this.handlePreAdd}><i className="fa fa-plus"></i></a>*/}
            </div>
          </div>
        </div>

        <div id="progress-list">
          {progressItems}
        </div>
      </div>  
    );
  },

  _onChange: function() {
    this.setState({
      keyword: HeaderStore.getKeyword(),
      filter: HeaderStore.getFilter(),
      orderby: HeaderStore.getOrderby()
    });
  }

});

module.exports = ProgressList;
