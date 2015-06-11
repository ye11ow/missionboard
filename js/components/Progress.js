var React = require('react/addons'),
    $ = require('jquery'),
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
    ProgressActions.updateProgress(this.props.progress.get("id"), -1);
  },*/

  handleDestroy: function() {
    var id = this.props.progress.get("id");
    
    swal({   
      title: chrome.i18n.getMessage("deleteMissionTitle"),
      text: chrome.i18n.getMessage("deleteMission"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: chrome.i18n.getMessage("modalYes"),
      cancelButtonText: chrome.i18n.getMessage("modalNo"),
    }, function(isConfirm){
      if (isConfirm) { 
        ProgressActions.destroy(id);
      }
    });
  },

  componentDidMount: function() {
    var progress = this.props.progress,
        $slider = $(`#${progress.get("id")}`).find('[data-role="slider"]');

    $slider.noUiSlider({
      start: progress.get("current"),
      connect: "lower",
      step: 1,
      range: {
        'min': [  0 ],
        'max': [ progress.get("total") ]
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
      //progress.set("current", parseInt($(this).val()));
      //ProgressActions.updateProgress(progress.get("id"), progress.get("current"));
      var $tips = $(this).parent().parent().find('[data-role="slider-current"]');
      $tips.hide();
    });
  },

  componentDidUpdate: function() {
    var progress = this.props.progress,
        $slider = $(`#${progress.get("id")}`).find('[data-role="slider"]'),
        options = $slider.noUiSlider('options');

    if (options) {
      if (options.range.max[0] !== progress.get("total") || options.start !== progress.get("current")) {
        $slider.noUiSlider({
          start: progress.get("current"),
          connect: "lower",
          step: 1,
          range: {
            'min': [  0 ],
            'max': [ progress.get("total") ]
          }
        }, true);
      }
    }
  },

  render: function() {
    var progress = this.props.progress,
        keyword = this.props.keyword,
        percentage = Math.floor(progress.get("current") * 100 / progress.get("total")),
        title = progress.get("title");

    if (keyword) {
      var start = title.toLowerCase().indexOf(keyword.toLowerCase()),
          length = keyword.length;

      title = `${title.slice(0, start)}<span class="title-highlight">${title.slice(start, start + length)}</span>${title.substring(start + length, title.length)}`;
    }

    return (
      <div id={progress.get("id")} className="panel panel-default">
        <div className="panel-body row" data-completed={progress.get("completed")} data-role="progress">
          <div className="col-lg-10">
            <h5 className="progress-title" dangerouslySetInnerHTML={{__html: title}} />
            <small className="progress-desc">{progress.get("description")}</small>
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
                <span data-role="current">{progress.get("current")}</span>/{progress.get("total")}
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
