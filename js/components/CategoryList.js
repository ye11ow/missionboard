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
  $(".category a").css("pointer-events", "auto");
}

var CategoryList = React.createClass({

  componentDidMount: function() {
    $("#main-menu").on("click", ".glyphicon-trash", this.handleCategoryDestroy);
  },

  getInitialState: function() {
    return {

    };
  },

  componentDidUpdate: function() {
    if ($("#main-menu .glyphicon-trash").css("display") !== "none") {
      this.handleCategoryEdit();
    }
  },

  handleCategoryClick: function(event) {
    var $target = $(event.target);
    var targetCategory = $(event.target).parent().attr("data-category");

    if (!targetCategory) {
      return;
    }

    if ($target.hasClass("glyphicon-chevron-up")) {
      var prevCategory = $(event.target).parent().prev().attr("data-category");
      CategoryActions.updateOrder(targetCategory, prevCategory);
    } else if ($target.hasClass("glyphicon-chevron-down")) {
      var nextCategory = $(event.target).parent().next().attr("data-category");
      CategoryActions.updateOrder(targetCategory, nextCategory);
    } else {
      if (targetCategory === this.state.category) {
        return;
      }

      var $category = $("#main-menu");

      $category.find(".active").removeClass("active");
      var $target = $(event.target).parent();
      $target.addClass("active");

      this.props.onCategorySwitch(targetCategory);
    }
  },

  handleCategoryAdd: function() {
    $("#category-add-title").show(300);
    $("#category-add-title").focus();

    $("#category-add").css("visibility", "hidden");
    $("#category-confirm").css("visibility", "visible");
    $("#category-cancel").css("visibility", "visible");
    $("#category-edit").css("visibility", "hidden");
  },

  handleCategoryEdit: function() {
    $(".category .glyphicon").css("display", "block");
    $(".category a").css("margin-left", "25px");
    $(".category a").css("pointer-events", "none");

    $("#category-add").css("visibility", "hidden");
    $("#category-confirm").css("visibility", "visible");
    $("#category-cancel").css("visibility", "hidden");
    $("#category-edit").css("visibility", "hidden");

    var length = $("#main-menu > ul li").length;
    if (length > 2) {
      $("#main-menu > ul li:nth-child(2) .glyphicon-chevron-up").hide();
      $("#main-menu > ul li:nth-child(" + (length - 1) + ") .glyphicon-chevron-down").hide();
    }
  },

  handleCategoryDestroy: function(event) {
    event.preventDefault();
    event.stopPropagation();
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
        var length = $("#main-menu > ul li").length;
        var id = $("#main-menu > ul li:nth-child(" + (length - 1) + ")").attr("data-category");
        var order = this.props.categories[id].order + 1;
        this.props.onCategoryCreate({
          title: title,
          order: order
        });
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
      <div id="main-menu" className="main-menu" onClick={this.handleCategoryClick}>
        <div className="category-header">Categories</div>
        <ul className="nav nav-pills nav-stacked">
          {categories.map(function(category) {
            if (category.system === false) {
              return <li className="category" draggable="true" key={category.id} data-category={category.id}><span className="glyphicon glyphicon-trash"></span><a href="#">{category.title}</a><span className="glyphicon glyphicon-chevron-down"></span><span className="glyphicon glyphicon-chevron-up"></span></li>;
            } else {
              return <li className="category active" draggable="true" key={category.id} data-category={category.id}><a href="#">{category.title}</a></li>;
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
