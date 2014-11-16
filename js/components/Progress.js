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

  componentDidMount: function() {
    var progress = this.props.progress;
    var $slider = $('#' + progress.id).find('[data-role="slider"]');
    $slider.noUiSlider({
      start: progress.current,
      connect: "lower",
      step: 1,
      range: {
        'min': [  0 ],
        'max': [ progress.total ]
      }
    });

    $slider.on('slide', function(){
      var $progress = $(this).parent().parent().find('[data-role="progress"]');
      $progress.find('[data-role="current"]').text(parseInt($(this).val()));
    });

    $slider.on('change', function(){
      progress.current = parseInt($(this).val());
      ProgressActions.doit(progress.id, progress.current);
    });
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
      <div id={progress.id} className="panel panel-default" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="panel-body row" data-completed={progress.completed} data-role="progress">
          <div className="col-lg-12">
            <h5 className="progress-title">{progress.title}</h5>
            <span className="glyphicon glyphicon-edit progress-edit" title="edit" style={hidden} onClick={this.handleEdit}></span>
            <span className="glyphicon glyphicon-check progress-done" title="mark as completed" style={hidden} onClick={this.handleFinish}></span>
            <span className="glyphicon glyphicon-trash progress-delete" title="delete" style={hidden} onClick={this.handleDestroy}></span>
            <span data-role="progress" className="label label-success label-progress">
              <span data-role="current">{progress.current}</span>
              /{progress.total}&nbsp;&nbsp;
              <small>{style.width}</small>
            </span>
            <div data-role="slider" className="progress-slider">
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Progress;
