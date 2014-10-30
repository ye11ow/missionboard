var React = require('react');
var ReactPropTypes = React.PropTypes;
var ProgressStore = require('../stores/ProgressStore');
var CategoryActions = require('../actions/CategoryActions');


function sortCategory(cA, cB) {
  return cA.order - cB.order;
}

function resetCategoryControl() {
  $("#category-add").css("visibility", "visible");
  $("#category-confirm").css("visibility", "hidden");
  $("#category-cancel").css("visibility", "hidden");
  $("#category-edit").css("visibility", "visible");

  $("#category-add-title").val("");
  $("#category-add-title").hide(300);

  $(".category .glyphicon").css("display", "none");
  $(".category a").css("margin-left", "0");
}

var CategoryList = React.createClass({

  componentDidMount: function() {
    $("#main-menu").on("click", ".glyphicon-trash", this.handleCategoryDestroy);
  },

  getInitialState: function() {
    return {

    };
  },

  handleCategorySwitch: function() {
    var newCategory = $(event.target).parent().attr("data-category");
    if (newCategory === undefined || newCategory === this.state.category) {
      return;
    }

    var $category = $(event.currentTarget);

    console.log($category);
    $category.find(".active").removeClass("active");
    var $target = $(event.target).parent();
    $target.addClass("active");

    this.props.onCategorySwitch(newCategory);
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

      this.props.onCategoryDestroy(id);
    }
  },

  handleCategoryCreate: function(event) {
    if (event.which === 13) {
      var $input = $(event.target);
      var title = $input.val()
      if (title && title.length > 0) {
        this.props.onCategoryCreate({title: title});
        $input.hide();
        resetCategoryControl();
      }
    }
  },

  handleCategoryConfirm: function() {
    if ($("#category-add-title").css("display") !== "none") {
      var e = $.Event("keypress");
      e.which = 13;
      e.target = $("#category-add-title")[0];
      this.handleCategoryCreate(e);
    }
    resetCategoryControl();
  },

  handleCategoryCancel: function() {
    resetCategoryControl();
  },

  render: function() {
    var categories = [];

    for (var i in this.props.categories) {
      categories.push(this.props.categories[i]);
      if (this.props.categories[i].id === this.props.category) {
        category = this.props.categories[i];
      }
    }

    if (!categories) {
      return;
    }
    categories.sort(sortCategory);

    return (
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
    );
  },

});

module.exports = CategoryList;
