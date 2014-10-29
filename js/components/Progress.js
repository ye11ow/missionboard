var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var ProgressActions = require('../actions/ProgressActions');

var mouseItvl = null;
var itvl = 100;

var Progress = React.createClass({

  propTypes: {
    progress: ReactPropTypes.object.isRequired
  },

  handleMouseEnter: function(event) {
    $panel = $(event.currentTarget);
    $panel.find(".progress-edit").show(300);
    $panel.find(".progress-done").show(300);
    $panel.find(".progress-delete").show(300);
  },

  handleMouseLeave: function(event) {
    $panel = $(event.currentTarget);
    $panel.find(".progress-edit").hide(300);
    $panel.find(".progress-done").hide(300);
    $panel.find(".progress-delete").hide(300);
  },

  handleMinus: function () {
    var progress = this.props.progress;
    if (progress.current > 0) {
      progress.current--;
      ProgressActions.doit(progress.id, progress.current);
    }
  },

  handleMinusing: function () {
    var self = this;
    mouseItvl = setInterval(function(){
      self.handleMinus();
    }, itvl);
  },

  handlePlus: function() {
    var progress = this.props.progress;
    if (progress.current < progress.total) {
      progress.current++;
      ProgressActions.doit(progress.id, progress.current);
    }
  },

  handlePlusing: function() {
    var self = this;
    mouseItvl = setInterval(function(){
      self.handlePlus();
    }, itvl);
  },

  handleMouseUp: function() {
    clearInterval(mouseItvl);
  },

  handleEdit: function() {
    var progress = this.props.progress;

    $("#progress-edit").attr("data-role", "edit");
    $("#progress-edit").attr("data-id", progress.id);
    $("#progress-edit").find(".modal-title").text("Editing");
    $("#progress-edit-save").text("Save");

    $("#progress-edit-title").val(progress.title);
    $("#progress-edit-current").val(progress.current);
    $("#progress-edit-total").val(progress.total);
    $("#progress-edit-category").val(progress.category);
    $("#progress-edit-description").val(progress.description);
    $("#progress-edit").modal("show");
  },

  handleFinish: function() {
    ProgressActions.finish(this.props.progress.id);
  },

  handleDestroy: function() {
    if (confirm("Do you want to delete this mission?")) {
      ProgressActions.destroy(this.props.progress.id);
    }
  },

  render: function() {
    var cx = React.addons.classSet;
    var progress = this.props.progress;
    var percentage = Math.floor(progress.current * 100 / progress.total);
    var style = {
      width: percentage + "%"
    };
    var hidden = {
      display: "none"
    };

    return (
      <div className="panel panel-default" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="panel-body row" data-completed={progress.completed} data-role="progress">
          <div className="col-lg-11">
            <h5 className="progress-title">{progress.title}</h5>
            <span className="glyphicon glyphicon-edit progress-edit" title="edit" style={hidden} onClick={this.handleEdit}></span>
            <span className="glyphicon glyphicon-check progress-done" title="mark as completed" style={hidden} onClick={this.handleFinish}></span>
            <span className="label label-success label-percent">{style.width}</span>
            <div className="progress">
              <div className="progress-bar" style={style}>
                {progress.current}/{progress.total}
              </div>
            </div>
            <div className="progress-control">
              <button className="progress-control-btn-left" 
                onClick={this.handleMinus}
                onMouseDown={this.handleMinusing}
                onMouseUp={this.handleMouseUp}
                onMouseOut={this.handleMouseUp}
              >-</button>
              <button className="progress-control-btn-right" 
                onClick={this.handlePlus} 
                onMouseDown={this.handlePlusing}
                onMouseUp={this.handleMouseUp}
                onMouseOut={this.handleMouseUp}
              >+</button>
            </div>
          </div>
          <div className="col-lg-1">
            <button className="btn btn-danger progress-delete" style={hidden} onClick={this.handleDestroy}>X</button>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Progress;
