var React = require('react/addons'),
    $ = require('jquery'),
    i18n = require("../helpers/I18n"),
    ProgressActions = require('../actions/ProgressActions');

var Progress = React.createClass({

  propTypes: {
    keyword: React.PropTypes.string,
    progress: React.PropTypes.object.isRequired,
  },

  handleEdit: function() {
    ProgressActions.setEditing(this.props.progress);
  },

  /*
  handleFinish: function() {
    ProgressActions.updateProgress(this.props.progress.id, -1);
  },*/

  handleDestroy: function() {
    var id = this.props.progress.id;
    
    swal({   
      title: i18n.getMessage("deleteMissionTitle"),
      text: i18n.getMessage("deleteMission"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: i18n.getMessage("modalYes"),
      cancelButtonText: i18n.getMessage("modalNo"),
    }, function(isConfirm){
      if (isConfirm) { 
        ProgressActions.destroy(id);
      }
    });
  },

  componentDidMount: function() {
    var progress = this.props.progress,
        $slider = $(`#${progress.id}`).find('[data-role="slider"]');

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

  componentDidUpdate: function() {
    var progress = this.props.progress,
        $slider = $(`#${progress.id}`).find('[data-role="slider"]'),
        options = $slider.noUiSlider('options');

    if (options) {
      if (options.range.max[0] !== progress.total || options.start !== progress.current) {
        $slider.noUiSlider({
          start: progress.current,
          connect: "lower",
          step: 1,
          range: {
            'min': [  0 ],
            'max': [ progress.total ]
          }
        }, true);
      }
    }
  },

  render: function() {
    var progress = this.props.progress,
        keyword = this.props.keyword,
        percentage = Math.floor(progress.current * 100 / progress.total),
        title = progress.title;

    if (keyword) {
      var start = title.toLowerCase().indexOf(keyword.toLowerCase()),
          length = keyword.length;

      title = `${title.slice(0, start)}<span class="title-highlight">${title.slice(start, start + length)}</span>${title.substring(start + length, title.length)}`;
    }

    return (
      <div id={progress.id} className="panel panel-default">
        <div className="panel-body row" data-completed={progress.completed} data-role="progress">
          <div className="col-lg-10">
            <h5 className="progress-title" dangerouslySetInnerHTML={{__html: title}} />
            <small className="progress-desc">{progress.description}</small>
            <label className="progress-percentage">{percentage}%</label>
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
              {/*<i className="fa fa-check  fa-lg progress-done" title="mark as completed" onClick={this.handleFinish} />*/}
              <i className="fa fa-pencil fa-lg progress-edit" onClick={this.handleEdit} /> 
              <i className="fa fa-trash  fa-lg progress-delete" onClick={this.handleDestroy} />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Progress;
