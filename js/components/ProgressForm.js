var React = require('react/addons'),
    $ = require('jquery'),
    i18n = require("../helpers/I18n"),
    ProgressActions = require('../actions/ProgressActions'),
    ProgressStore = require('../stores/ProgressStore');

function validate($title, $current, $total) {
  var title = $title.val(),
      current = parseInt($current.val()),
      total = parseInt($total.val());
  
  if (!title || title.length == 0) {
    $title.css("box-shadow", "inset 0 -2px 0 #e51c23");
    return false;
  }
  if (isNaN(current)) {
    $current.css("box-shadow", "inset 0 -2px 0 #e51c23");
    $current.val("");
    $current.attr("placeholder", i18n.getMessage("labelMissionProgressError"));
    return false;
  }
  if (isNaN(total)) {
    $total.css("box-shadow", "inset 0 -2px 0 #e51c23");
    $total.val("");
    $total.attr("placeholder", i18n.getMessage("labelMissionProgressError"));
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

  propTypes: {
    categories: React.PropTypes.array.isRequired,
  },

  mixins: [React.addons.LinkedStateMixin],

  componentWillUnmount() {
    ProgressStore.removeChangeListener(this._onChange);
  },

  getInitialState() {
    return EMPTY_PROGRESS;
  },

  handleSave() {
    var editing = this.state;

    if (validate($(this.refs.progressTitle.getDOMNode()), $(this.refs.progressCurrent.getDOMNode()), $(this.refs.progressTotal.getDOMNode()))) {
      var current = parseInt(editing.current),
          total = parseInt(editing.total);

      if ($modal.attr("data-role") === "add") {
        ProgressActions.create(editing.title, current, total, editing.category, null, editing.description);
      } else if ($modal.attr("data-role") === "edit") {
        ProgressActions.update(editing.id, editing.title, current, total, editing.category, null, editing.description);
      }

      this.handleCancel();
    }
  },

  handleCancel() {
    ProgressActions.setEditing(null);
  },

  componentDidMount() {
    var self = this;
    $modal = $(this.refs.progressFormModal.getDOMNode());

    ProgressStore.addChangeListener(this._onChange);

    $modal.on('shown.bs.modal', function () {
      $(self.refs.progressCurrent.getDOMNode()).focus();
    });

    $modal.on('hidden.bs.modal', function () {
      ProgressActions.setEditing(null);
    });
  },

  componentDidUpdate() {
    var editing = this.state;

    if (editing.title) {
      $modal.modal("show");
      $(this.refs.progressTitle.getDOMNode()).css("box-shadow", "inset 0 -1px 0 #ddd");
      $(this.refs.progressCurrent.getDOMNode()).css("box-shadow", "inset 0 -1px 0 #ddd");
      $(this.refs.progressTotal.getDOMNode()).css("box-shadow", "inset 0 -1px 0 #ddd");
    } else {
      $modal.modal("hide");
    }
  },

  render() {
    var categories = this.props.categories,
        categoryList = [],
        header = "",
        role = "",
        confirmLabel = "";

    if (this.state && this.state.id) {
      header = i18n.getMessage("labelMissionFormEdit");
      role = "edit";
      confirmLabel = i18n.getMessage("labelMissionFormUpdate");
    } else if (this.state) {
      header = i18n.getMessage("labelMissionFormCreate");
      role = "add";
      confirmLabel = i18n.getMessage("labelMissionFormNew");
    }

    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];

      if (!category.system) {
        categoryList.push(<option key={category.id} value={category.id}>{category.title}</option>);
      }
    }

    return (
    <div ref="progressFormModal" className="modal fade" tabIndex="-1" data-role={role}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
            <h4 className="modal-title">{header}</h4>
          </div>
          <div className="modal-body">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label">{i18n.getMessage("labelMissionFormTitle")}</label>
                <div className="col-sm-10">
                  <input ref="progressTitle" type="text" className="form-control" placeholder="Gundam Seed" valueLink={this.linkState("title")} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">{i18n.getMessage("labelMissionFormDesc")}</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" valueLink={this.linkState("description")} placeholder={i18n.getMessage("labelMissionFormDescTips")} />
                </div>
              </div>
              <div className="row">
                <div className="progress-current col-sm-5 form-group">
                  <label className="control-label">{i18n.getMessage("labelMissionFormCurrent")}</label>
                  <div className="">
                    <input ref="progressCurrent" type="number" className="form-control" placeholder={i18n.getMessage("labelMissionProgressError")} valueLink={this.linkState("current")} />
                  </div>
                </div>
                <div className="progress-total form-group col-sm-5">
                  <label className="control-label">{i18n.getMessage("labelMissionFormTotal")}</label>
                  <div className="">
                    <input ref="progressTotal" type="number" className="form-control" placeholder={i18n.getMessage("labelMissionProgressError")} valueLink={this.linkState("total")} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">{i18n.getMessage("labelMissionFormCategory")}</label>
                <div className="col-sm-10">
                  <select className="form-control" valueLink={this.linkState("category")}>
                    {categoryList}
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={this.handleSave}>{confirmLabel}</button>
            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.handleCancel}>{i18n.getMessage("labelMissionFormCancel")}</button>
          </div>
        </div>
      </div>
    </div>
    );
  },

  _onChange() {
    var editing = ProgressStore.getEditing();

    if (!editing) {
      this.setState(EMPTY_PROGRESS);
    } else {
      this.setState(editing);
    }
  }
});

module.exports = ProgressForm;
