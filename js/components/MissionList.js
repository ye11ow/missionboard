var React = require('react'),
    i18n = require("../helpers/I18n"),
    Mission = require('./Mission'),
    MissionForm = require('./MissionForm'),
    MissionActions = require('../actions/MissionActions'),
    CategoryActions = require('../actions/CategoryActions'),
    HeaderStore = require('../stores/HeaderStore'),
    HeaderConstants = require('../constants/HeaderConstants');

// TODO optimize
function getSorting(order) {
  var key = order.by;
  if (order.type === "asc") {
    return function (pA, pB) {
      if (typeof pA[key] === "string") {
        return pA[key].localeCompare(pB[key]);
      } else {
        return pA[key] - pB[key];
      }
    }
  } else {
    return function (pA, pB) {
      if (typeof pA[key] === "string") {
        return pB[key].localeCompare(pA[key]);
      } else {
        return pB[key] - pA[key];
      }
    }
  }
}

var MissionList = React.createClass({

  propTypes: {
    missions: React.PropTypes.object,
    category: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array.isRequired
  },

  componentDidMount() {
    HeaderStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    HeaderStore.removeChangeListener(this._onChange);
  },

  getInitialState () {
    return {
      //count: this.props.missions.count,
      keyword: HeaderStore.getKeyword(),
      filter: HeaderStore.getFilter(),
      orderby: HeaderStore.getOrderby()
    };
  },

  handleFocus() {
    this.refs.missionTip.textContent = i18n.getMessage("labelCreateMissionTips");
  },

  handleBlur() {
    var input = this.refs.missionTitle,
        title = input.value;

    if (title && title.length > 0) {
      input.parentNode.classList.add("input--filled");
    } else {
      input.parentNode.classList.remove("input--filled");
      this.refs.missionTip.textContent = i18n.getMessage("labelCreateMission");
    }
  },

  handlePreAdd(event) {
    var input = this.refs.missionTitle;
    if (event.which === 13) {

      // "ENTER" pressed
      var title = input.value;

      if (typeof title === "string" && title.length > 0) {
        MissionActions.setEditing({
          id: null,
          title: title,
          category: this.props.category.id
        });
      }

      input.value = "";
    } else if (event.which === 27) {

      // "ESC" pressed
      input.value = "";
      input.blur();
    }
  },

  render() {
    var missions = this.props.missions,
        missionList = [],
        orderby = this.state.orderby,
        keyword = this.state.keyword,
        filter = this.state.filter,
        style = {};

    // a key is need here for Mission.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in missions) {
      var mission = missions[key];

      if (keyword.length > 0) {
        if (mission.title.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
          continue;
        }
      }

      if (filter === HeaderConstants.HEADER_FILTER_CURRENT && mission.completed) {
        continue;
      }
      if (filter === HeaderConstants.HEADER_FILTER_COMPLETED && !mission.completed) {
        continue;
      }

      mission.percent = mission.current * 100 / mission.total; 

      missionList.push(mission);
    }

    missionList.sort(getSorting(orderby));

    if (missionList.length === 0) {
      style = {
        "margin-top": "20%"
      };
    }

    return (
      <div className="container-fluid main-container">

        <MissionForm categories={this.props.categories} />

        <div className="mission-toolbar" style={style}>
          <div className="row">
            <div className="col-lg-7 col-lg-offset-2">
              <span className="input input--hoshi">
                <input ref="missionTitle" type="text" className="input__field input__field--hoshi" onKeyDown={this.handlePreAdd} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <label className="input__label input__label--hoshi input__label--hoshi-color-1">
                  <span ref="missionTip" className="input__label-content input__label-content--hoshi">{i18n.getMessage("labelCreateMission")}</span>
                </label>
              </span>
              {/*<a href="#" ref="createBtn" className="btn btn-primary create-mission" onClick={this.handlePreAdd}><i className="fa fa-plus" /></a>*/}
            </div>
          </div>
        </div>

        <div className="mission-list">
          {missionList.map((function(p) {
            return <Mission keyword={keyword} key={p.id} mission={p} />
          }))}
        </div>
      </div>  
    );
  },

  _onChange() {
    this.setState({
      keyword: HeaderStore.getKeyword(),
      filter: HeaderStore.getFilter(),
      orderby: HeaderStore.getOrderby()
    });
  }

});

module.exports = MissionList;
