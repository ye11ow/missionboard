var React = require('react');
var ProgressList = require('./ProgressList');
var ProgressStore = require('../stores/ProgressStore');

var CategoryStore = require('../stores/CategoryStore');
var CategoryActions = require('../actions/CategoryActions');


function resetCategoryControl() {
  $("#category-add").css("visibility", "visible");
  $("#category-confirm").css("visibility", "hidden");
  $("#category-cancel").css("visibility", "hidden");
  $("#category-edit").css("visibility", "visible");

  $("#category-add-title").text("");
  $("#category-add-title").hide(300);

  $(".category .glyphicon").css("display", "none");
  $(".category a").css("margin-left", "0");
}

function sortCategory(cA, cB) {
  return cA.order - cB.order;
}

function getProgressState() {
  return {
    progresses: ProgressStore.getAll(),
    length: ProgressStore.getLength(),
    categories: CategoryStore.getAll(),
    category: $("#main-menu").find(".active").attr("data-category"),
  };
}

var MissionBoard = React.createClass({

  getInitialState: function() {
    return getProgressState();
  },

  componentDidMount: function() {
    ProgressStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);

    $.when( 
      $.get(SERVER + "/missions/"),
      $.get(SERVER + "/categories/") 
    ).done(function(progresses, categories){
      if (progresses[0]) {
        progresses = progresses[0];
      }
      if (categories[0]) {
        categories = categories[0];
      }

      var _progresses = {};
      var _categories = {}

      $.each(progresses, function(i, d) {
        d.id = d["_id"]["$oid"];
        delete d["_id"];
        _progresses[d.id] = d;
        length++;
      });

      $.each(categories, function(i, d) {
        d.id = d["_id"]["$oid"];
        delete d["_id"];
        delete d.orderby["_id"];
        _categories[d.id] = d;
      });

      if (this.isMounted()) {
        ProgressStore.setProgresses(_progresses, length);
        CategoryStore.setCategories(_categories);
        this.setState(getProgressState());
      }

    }.bind(this));

    $("#main-menu").on("click", ".glyphicon-trash", this.handleCategoryDestroy);
  },

  componentWillUnmount: function() {
    ProgressStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
  },

  handleCategorySwitch: function(event) {
    var newCategory = $(event.target).parent().attr("data-category");
    if (newCategory === undefined || newCategory === this.state.category) {
      return;
    }

    var $category = $(event.currentTarget);
    $category.find(".active").removeClass("active");
    var $target = $(event.target).parent();
    $target.addClass("active");

    this.setState(getProgressState());
  },

  handleCategoryAdd: function() {
    $("#category-add-title").show(300);

    $("#category-add").css("visibility", "hidden");
    $("#category-confirm").css("visibility", "visible");
    $("#category-cancel").css("visibility", "visible");
    $("#category-edit").css("visibility", "hidden");

  },

  handleCategoryEdit: function() {
    $(".category .glyphicon").css("display", "block");
    $(".category a").css("margin-left", "25px");

    $("#category-add").css("visibility", "hidden");
    $("#category-confirm").css("visibility", "visible");
    $("#category-cancel").css("visibility", "hidden");
    $("#category-edit").css("visibility", "hidden");
  },

  handleCategoryDestroy: function(event) {
    event.preventDefault();
    if (confirm("Do you want to delete this category?")) {
      var $target = $(event.target).parent();
      var id = $target.attr("data-category");

      if (ProgressStore.getLengthByCategory(id) > 0 ) {
        if (!confirm("There are some progresses under this cateogry, do you really want to delete it?")) {
          return;
        }
      }

      CategoryActions.destroy(id);
    }
  },

  handleCategoryCreate: function(event, confirm) {
    if (confirm === true || event.which === 13) {
      var $input = $(event.target);
      var title = $input.val()
      if (title && title.length > 0) {
        CategoryActions.create(title);
        $input.hide();
      }
    }
  },

  handleCategoryConfirm: function() {
    if ($("#category-add-title").css("display") !== "none") {
      this.handleCategoryCreate(null, true);
    }
    resetCategoryControl();
  },

  handleCategoryCancel: function() {
    resetCategoryControl();
  },

  render: function() {
    var progresses = this.state.progresses;
    var _progresses = {};
    var categories = [];
    var category = null;

    for (var i in this.state.categories) {
      categories.push(this.state.categories[i]);
      if (this.state.categories[i].id === this.state.category) {
        category = this.state.categories[i];
      }
    }
    categories.sort(sortCategory);

    // a key is need here for Progress.
    // see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    for (var key in progresses) {
      if (!category || progresses[key].category === this.state.category || category.system === true) {
        _progresses[key] = progresses[key];
      }
    }

    return (
      <div>
        <nav className="navbar navbar-default banner">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">MissionBoard</a>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#">Start Tour</a></li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">ye11ow <span className="caret"></span></a>
                  <ul className="dropdown-menu" role="menu">
                    <li><a href="#">Perference</a></li>
                    <li className="divider"></li>
                    <li><a href="#">Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div id="main-menu" className="main-menu" onClick={this.handleCategorySwitch}>
          <ul className="nav nav-pills nav-stacked">
            {categories.map(function(category) {
              if (category.system === false) {
                return <li className="category" key={category.id} data-category={category.id}><span className="glyphicon glyphicon-trash"></span><a href="#">{category.title}</a></li>;
              } else {
                return <li className="category active" key={category.id} data-category={category.id}><a href="#">{category.title}</a></li>;
              }
            })}
            <li className="category-title">
              <input id="category-add-title" type="text" className="form-control" placeholder="title" onKeyPress={this.handleCategoryCreate} />
            </li>
          </ul>
          <div className="category-dashboard row">
            <span id="category-confirm" className="glyphicon glyphicon-ok col-sm-3 category-control category-confirm" onClick={this.handleCategoryConfirm}></span>
            <span id="category-cancel" className="glyphicon glyphicon-remove col-sm-3 category-control category-cancel" onClick={this.handleCategoryCancel}></span>
            <span id="category-add" className="glyphicon glyphicon-plus col-sm-3 category-control category-add" onClick={this.handleCategoryAdd}></span>
            <span id="category-edit" className="glyphicon glyphicon-cog col-sm-3 category-control category-edit" onClick={this.handleCategoryEdit}></span>
          </div>
        </div>
        <ProgressList progresses={_progresses} category={category} categories={this.state.categories} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getProgressState());
  }
});

module.exports = MissionBoard;
