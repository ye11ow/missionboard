var React = require('react'),
    $ = require('jquery'),
    Progress = require('./Progress'),
    ProgressForm = require('./ProgressForm'),
    ProgressActions = require('../actions/ProgressActions'),
    CategoryActions = require('../actions/CategoryActions'),
    HeaderStore = require('../stores/HeaderStore');


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

function getOverallProgress(progresses) {
  var sum = 0;
  var count = 0;
  for (var i in progresses) {
    sum += progresses[i].percent;
    count++;
  }

  if (count === 0) {
    return 0;
  }

  return Math.floor(sum / count);
}

var ProgressList = React.createClass({

  propTypes: {
    progresses: React.PropTypes.object,
    category: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array.isRequired
  },

  componentDidMount: function() {
    HeaderStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    HeaderStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return {
      //count: this.props.progresses.count,
      keyword: HeaderStore.getKeyword(),
      filter: HeaderStore.getFilter(),
      orderby: HeaderStore.getOrderby()
    };
  },

  handleFocus: function() {
    $(this.refs.progressTip.getDOMNode()).text(chrome.i18n.getMessage("labelCreateMissionTips"));
    //$(this.refs.createBtn.getDOMNode()).show();
  },

  handleBlur: function() {
    var $input = $(this.refs.progressTitle.getDOMNode()),
        title = $input.val();

    if (title && title.length > 0) {
      $input.parent().addClass("input--filled");
    } else {
      $input.parent().removeClass("input--filled");
      //$(this.refs.createBtn.getDOMNode()).hide(300);
      $(this.refs.progressTip.getDOMNode()).text(chrome.i18n.getMessage("labelCreateMission"));
    }
  },

  handlePreAdd: function(event) {
    if (event.which === 13) {

      // "ENTER" pressed
      var $input = $(this.refs.progressTitle.getDOMNode()),
          title = $input.val();

      if (typeof title === "string" && title.length > 0) {
        ProgressActions.setEditing({
          id: null,
          title: title,
          category: this.props.category.id
        });
      }

      $input.val("");
    } else if (event.which === 27) {

      // "ESC" pressed
      var $input = $(this.refs.progressTitle.getDOMNode());
      $input.val("").blur();
    }
  },

  render: function() {
    var self = this,
        progresses = this.props.progresses,
        progressItems = [],
        _progresses = [],
        orderby = this.state.orderby,
        keyword = this.state.keyword,
        filter = this.state.filter;

    if (this.props.category) {

      // a key is need here for Progress.
      // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
      for (var key in progresses) {
        var progress = progresses[key];

        if (keyword.length > 0) {
          if (progress.title.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            continue;
          }
        }

        if (filter === "current" && progress.completed) {
          continue;
        }
        if (filter === "completed" && !progress.completed) {
          continue;
        }

        progress.percent = progress.current * 100 / progress.total; 

        _progresses.push(progress);
      }

      var sortProgress = getSorting(orderby);
      _progresses.sort(sortProgress);

      _progresses.forEach(function(p) {
        progressItems.push(<Progress keyword={keyword} key={p.id} progress={p} />);
      });

      //$("#progress-count").text(Object.keys(_progresses).length);
      //$("#overall-progress").text(getOverallProgress(progresses) + "%");
    }

    return (
      <div className="container-fluid main-container">

        <ProgressForm categories={this.props.categories} />

        <div className="progress-toolbar">
          <div className="row">
            <div className="col-lg-7 col-lg-offset-2">
              <span className="input input--hoshi">
                <input ref="progressTitle" type="text" className="input__field input__field--hoshi" onKeyDown={this.handlePreAdd} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <label className="input__label input__label--hoshi input__label--hoshi-color-1">
                  <span ref="progressTip" className="input__label-content input__label-content--hoshi">{chrome.i18n.getMessage("labelCreateMission")}</span>
                </label>
              </span>
              {/*<a href="#" ref="createBtn" className="btn btn-primary create-progress" onClick={this.handlePreAdd}><i className="fa fa-plus" /></a>*/}
            </div>
          </div>
        </div>

        <div className="progress-list">
          {progressItems}
        </div>
      </div>  
    );
  },

  _onChange: function() {
    this.setState({
      keyword: HeaderStore.getKeyword(),
      filter: HeaderStore.getFilter(),
      orderby: HeaderStore.getOrderby()
    });
  }

});

module.exports = ProgressList;
