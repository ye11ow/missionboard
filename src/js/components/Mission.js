var React = require('react'),
    i18n = require("../helpers/I18n"),
    noUiSlider = require("nouislider"),
    swal = require("sweetalert"),
    MissionActions = require('../actions/MissionActions');

var sliderWidth = 955; 

var Mission = React.createClass({

  propTypes: {
    keyword: React.PropTypes.string,
    mission: React.PropTypes.object.isRequired,
  },

  getInitialState () {
    return {
      sliding: false,
      current: this.props.mission.current
    };
  },

  handleEdit() {
    MissionActions.setEditing(this.props.mission);
  },

  handleDestroy() {
    var id = this.props.mission.id;
    
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
        MissionActions.destroy(id);
      }
    });
  },

  componentDidMount() {
    var self = this,
        mission = this.props.mission,
        slider = this.refs.slider;

    noUiSlider.create(slider, {
      start: mission.current,
      connect: "lower",
      step: 1,
      range: {
        'min': [ 0 ],
        'max': [ mission.total ]
      }
    });

    slider.noUiSlider.options = {
      max: mission.total
    };

    slider.noUiSlider.on('slide', function(values, handle){
      self.setState({
        sliding: true, 
        current: parseInt(values[handle])
      });
    });

    slider.noUiSlider.on('change', function(values, handle){
      MissionActions.updateMission(mission.id, parseInt(values[handle]));
      self.setState({
        sliding: false,
        current: mission.current
      });
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      current: nextProps.mission.current
    });
  },

  componentDidUpdate() {
    var mission = this.props.mission,
        slider = this.refs.slider;

    sliderWidth = slider.offsetWidth;

    if (slider.noUiSlider.options.max !== mission.total) {
      slider.noUiSlider.destroy();

      noUiSlider.create(slider, {
        start: mission.current,
        connect: "lower",
        step: 1,
        range: {
          'min': [ 0 ],
          'max': [ mission.total ]
        }
      });

      slider.noUiSlider.options = {
        max: mission.total
      };
    }
  },

  render() {
    var mission = this.props.mission,
        current = this.state.current,
        keyword = this.props.keyword,
        percentage = Math.floor(current * 100 / mission.total),
        sliderStyle = {
          display: this.state.sliding ? "block" : "none",
          left: sliderWidth * percentage / 100
        },
        title = mission.title;

    if (keyword) {
      var start = title.toLowerCase().indexOf(keyword.toLowerCase()),
          length = keyword.length;

      title = `${title.slice(0, start)}<span class="title-highlight">${title.slice(start, start + length)}</span>${title.substring(start + length, title.length)}`;
    }

    return (
      <div className="panel panel-default">
        <div className="panel-body row">
          <div className="col-lg-10"> 
            <h5 className="mission-title" dangerouslySetInnerHTML={{__html: title}} />
            <small className="mission-desc">{mission.description}</small>
            <label className="mission-percentage">{percentage}%</label>
            <div ref="slider" className="mission-slider">
            </div>
            <div className="slider-tip">
              <span ref="tipCurrent" style={sliderStyle}>{current}</span>
            </div>
          </div>
          <div className="col-lg-2">
            <div>
              <span className="label label-success label-mission">
                <span>{current}</span>/{mission.total}
              </span>
            </div>
            <div className="mission-control">
              <i className="fa fa-pencil fa-lg mission-edit" onClick={this.handleEdit} /> 
              <i className="fa fa-trash  fa-lg mission-delete" onClick={this.handleDestroy} />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Mission;
