 /**
 * @jsx React.DOM
 */


var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var ProgressActions = require('../actions/ProgressActions');

var mouseItvl = null;
var itvl = 100;

var Progress = React.createClass({

  propTypes: {
    progress: ReactPropTypes.object.isRequired
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

  handleDestroy: function() {
    ProgressActions.destroy(this.props.key);
  },

  render: function() {
    var cx = React.addons.classSet;
    var progress = this.props.progress;
    var percentage = Math.floor(progress.current * 100 / progress.total);
    var style = {
      width: percentage + "%"
    };

    return (
      <div className="row" data-completed={progress.completed} data-role="progress">
        <div className="col-lg-11">
          <span className="glyphicon glyphicon-edit progress-edit hidden" onClick={this.handleEdit}></span><h5 className="progress-title">{progress.title}</h5>
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
          <button className="btn btn-danger progress-delete hidden" onClick={this.handleDestroy}>X</button>
        </div>
      </div>
    );
  },
});

module.exports = Progress;
