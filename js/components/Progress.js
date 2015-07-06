var React = require('react/addons'),
    $ = require('jquery'),
    i18n = require("../helpers/I18n"),
    ProgressActions = require('../actions/ProgressActions');

var Progress = React.createClass({

  propTypes: {
    keyword: React.PropTypes.string,
    progress: React.PropTypes.object.isRequired,
  },

  getInitialState () {
    return {
      current: this.props.progress.current
    };
  },

  handleEdit() {
    ProgressActions.setEditing(this.props.progress);
  },

  handleDestroy() {
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

  componentDidMount() {
    var self = this,
        progress = this.props.progress,
        $slider = $(this.refs.slider.getDOMNode());

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
      var val = parseInt($(this).val()),
          $container = $(this).parent().parent();

      self.setState({ current: val }); 

      var $tips =  $(self.refs.tipCurrent.getDOMNode());
      $tips.css("left", $(this).find(".noUi-origin").css("left"));
      $tips.show();
    });

    $slider.on('change', function(){
      progress.current = parseInt($(this).val());
      ProgressActions.updateProgress(progress.id, progress.current);
      $(self.refs.tipCurrent.getDOMNode()).hide();
    });
  },

  componentDidUpdate() {
    var progress = this.props.progress,
        $slider = $(this.refs.slider.getDOMNode()),
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

  render() {
    var progress = this.props.progress,
        current = this.state.current,
        keyword = this.props.keyword,
        percentage = Math.floor(current * 100 / progress.total),
        title = progress.title;

    if (keyword) {
      var start = title.toLowerCase().indexOf(keyword.toLowerCase()),
          length = keyword.length;

      title = `${title.slice(0, start)}<span class="title-highlight">${title.slice(start, start + length)}</span>${title.substring(start + length, title.length)}`;
    }

    return (
      <div className="panel panel-default">
        <div className="panel-body row">
          <div className="col-lg-10">
            <h5 className="progress-title" dangerouslySetInnerHTML={{__html: title}} />
            <small className="progress-desc">{progress.description}</small>
            <label className="progress-percentage">{percentage}%</label>
            <div ref="slider" className="progress-slider">
            </div>
            <div className="slider-tip">
              <span ref="tipCurrent">{current}</span>
            </div>
          </div>
          <div className="col-lg-2">
            <div>
              <span className="label label-success label-progress">
                <span>{current}</span>/{progress.total}
              </span>
            </div>
            <div className="progress-control">
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
