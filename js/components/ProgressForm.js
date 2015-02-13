var React = require('react/addons'),
    ProgressActions = require('../actions/ProgressActions'),
    ProgressStore = require('../stores/ProgressStore');

function validate(title, current, total) {
  var current = parseInt(current);
  var total = parseInt(total);
  if (!title || title.length == 0) {
    //$title.css("box-shadow", "inset 0 -2px 0 #e51c23");
    return false;
  }
  if (isNaN(current)) {
    //$current.css("box-shadow", "inset 0 -2px 0 #e51c23");
    //$current.val("");
    //$current.attr("placeholder","number here");
    return false;
  }
  if (isNaN(total)) {
    //$total.css("box-shadow", "inset 0 -2px 0 #e51c23");
    //$total.val("");
    //$total.attr("placeholder","number here");
    return false;
  }

  return true;
}

var EMPTY_PROGRESS = {
  id: null,
  title: null,
  current: null,
  total: null,
  description: null,
  category: null,
}

var $modal = null;

var ProgressForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  componentWillUnmount: function() {
    ProgressStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return EMPTY_PROGRESS;
  },

  handleSave:function () {
    var editing = this.state;

    if (validate(editing.title, editing.current, editing.total)) {
      var current = parseInt(editing.current),
          total = parseInt(editing.total);

      if ($modal.attr("data-role") === "add") {
        ProgressActions.create(editing.title, current, total, editing.category, null, editing.description);
      } else if ($modal.attr("data-role") === "edit") {
        ProgressActions.update(editing.id,
          editing.title, current, total, editing.category, null, editing.description);
      }

      this.handleCancel();
    }
  },

  handleCancel: function() {
    ProgressActions.setEditing(null);
  },

  componentDidMount: function() {
    $modal = $(this.refs.progressFormModal.getDOMNode());

    ProgressStore.addChangeListener(this._onChange);

    $modal.on('shown.bs.modal', function () {
      $("#progress-edit-current").focus();
    });

    $modal.on('hidden.bs.modal', function () {
      ProgressActions.setEditing(null);
    });
  },

  componentDidUpdate: function() {
    var editing = this.state;

    if (editing.title) {
      $modal.modal("show");
    } else {
      $modal.modal("hide");
    }
  },

  render: function() {
    var categories = this.props.categories,
        header = "",
        role = "",
        confirmLabel = "",
        categoryList = [];

    if (this.state && this.state.id) {
      header = chrome.i18n.getMessage("labelMissionFormEdit");
      role = "edit";
      confirmLabel = chrome.i18n.getMessage("labelMissionFormEdit");
    } else if (this.state) {
      header = chrome.i18n.getMessage("labelMissionFormCreate");
      role = "add";
      confirmLabel = chrome.i18n.getMessage("labelMissionFormNew");
    }

    for (var key in categories) {
      var category = categories[key];

      if (!category.system) {
        categoryList.push(<option key={category.id} value={category.id}>{category.title}</option>);
      }
    }

    categoryList.reverse();

    return (
    <div ref="progressFormModal" className="modal fade" tabIndex="-1" data-role={role}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
            <h4 className="modal-title">{header}</h4>
          </div>
          <div className="modal-body">
            <form id="progress-edit-form" className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label">{chrome.i18n.getMessage("labelMissionFormTitle")}</label>
                <div className="col-sm-10">
                  <input id="progress-edit-title" type="text" className="form-control" placeholder="Gundam Seed" valueLink={this.linkState("title")} />
                </div>
              </div>
              <div className="row">
                <div className="progress-current col-sm-5 form-group">
                  <label className="control-label">{chrome.i18n.getMessage("labelMissionFormCurrent")}</label>
                  <div className="">
                    <input id="progress-edit-current" type="number" className="form-control" placeholder="0" valueLink={this.linkState("current")} />
                  </div>
                </div>
                <div className="progress-total form-group col-sm-5">
                  <label className="control-label">{chrome.i18n.getMessage("labelMissionFormTotal")}</label>
                  <div className="">
                    <input id="progress-edit-total" type="number" className="form-control" placeholder="48" valueLink={this.linkState("total")} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">{chrome.i18n.getMessage("labelMissionFormCategory")}</label>
                <div className="col-sm-10">
                  <select id="progress-edit-category" className="form-control" valueLink={this.linkState("category")}>
                    {categoryList}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">{chrome.i18n.getMessage("labelMissionFormDesc")}</label>
                <div className="col-sm-10">
                  <input type="text" id="progress-edit-description" className="form-control" valueLink={this.linkState("description")} />
                  <span className="help-block">Markdown supported</span>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button id="progress-edit-save" type="button" className="btn btn-primary" onClick={this.handleSave}>{confirmLabel}</button>
            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.handleCancel}>{chrome.i18n.getMessage("labelMissionFormCancel")}</button>
          </div>
        </div>
      </div>
    </div>
    );
  },

  _onChange: function() {
    var editing = ProgressStore.getEditing();

    if (!editing) {
      this.setState(EMPTY_PROGRESS);
    } else {
      this.setState(editing);
    }
  }
});

module.exports = ProgressForm;
