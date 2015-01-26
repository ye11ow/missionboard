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
  },

  handleMouseLeave: function(event) {
    $panel = $(event.currentTarget);
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

  /*
  handleFinish: function() {
    ProgressActions.updateProgress(this.props.progress.id, -1);
  },*/

  handleDestroy: function() {
    var id = this.props.progress.id;
    
    swal({   
      title: "Delete Mission?",
      text: "Do you want to delete this mission?",
      type: "warning",
      showCancelButton: true,   
      confirmButtonColor: "#DD6B55",   
      confirmButtonText: "Yes!",   
      cancelButtonText: "No!",   
    }, function(isConfirm){
      if (isConfirm) { 
        ProgressActions.destroy(id);
      }
    });
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
      var val = parseInt($(this).val());
      var $container = $(this).parent().parent();

      $container.find('[data-role="current"]').text(val);
      var $tips = $(this).parent().parent().find('[data-role="slider-current"]');
      $tips.text(val);
      $tips.css("left", $(this).find(".noUi-origin").css("left"));
      $tips.show();
    });

    $slider.on('change', function(){
      progress.current = parseInt($(this).val());
      ProgressActions.updateProgress(progress.id, progress.current);
      var $tips = $(this).parent().parent().find('[data-role="slider-current"]');
      $tips.hide();
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
          <div className="col-lg-10">
            <h5 className="progress-title">{progress.title}</h5>
            <label className="progress-percentage">{style.width}</label>
            <div data-role="slider" className="progress-slider">
            </div>
            <div className="slider-tip">
              <span data-role="slider-current"></span>
            </div>
          </div>
          <div className="col-lg-2">
            <div>
              <span data-role="progress" className="label label-success label-progress">
                <span data-role="current">{progress.current}</span>/{progress.total}
              </span>
            </div>
            <div className="progress-control">
              {/*<i className="fa fa-check  fa-lg progress-done" title="mark as completed" onClick={this.handleFinish}></i>*/}
              <i className="fa fa-pencil fa-lg progress-edit" title="edit" onClick={this.handleEdit}></i> 
              <i className="fa fa-trash  fa-lg progress-delete" title="delete" onClick={this.handleDestroy}></i>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Progress;
