var React = require('react');
var ReactPropTypes = React.PropTypes;
var ProgressStore = require('../stores/ProgressStore');
var CategoryActions = require('../actions/CategoryActions');

function sortCategory(cA, cB) {
  return cA.order - cB.order;
}

var MODE_NORMAL  = 1,
    MODE_ADDING  = 2,
    MODE_EDITING = 3;

var CategoryList = React.createClass({

  componentDidMount: function() {
    $("#main-menu").on("click", ".glyphicon-trash", this.handleCategoryDestroy);
  },

  getInitialState: function() {
    return {
      mode: MODE_NORMAL
    };
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

      var $category = $("#main-menu"),
          $target = $(event.target).parent();

      $category.find(".active").removeClass("active");
      $target.addClass("active");

      this.props.onCategorySwitch(targetCategory);
    }
  },

  resetCategoryControl: function() {
    var $title = $(this.refs.categoryAddTitle.getDOMNode());
    $title.val("");
    //$title.hide(300);

    this.setState({ mode: MODE_NORMAL });
  },

  handleCategoryAdd: function() {
    var $title = $(this.refs.categoryAddTitle.getDOMNode());
    //$title.show(300);
    $title.focus();

    this.setState({ mode: MODE_ADDING });
  },

  handleCategoryEdit: function() {
    var length = $("#main-menu > ul li").length;
    if (length > 2) {
      $("#main-menu > ul li:nth-child(2) .glyphicon-chevron-up").css("visibility", "hidden");
      $("#main-menu > ul li:nth-child(" + (length - 1) + ") .glyphicon-chevron-down").css("visibility", "hidden");
    }

    this.setState({ mode: MODE_EDITING });
  },

  handleCategoryDestroy: function(event) {
    event.preventDefault();
    event.stopPropagation();
    var self = this,
        $target = $(event.target).parent(),
        id = $target.attr("data-category"),
        text = "Do you want to delete this category?";

    if (ProgressStore.getLengthByCategory(id) > 0 ) {
      text = "There are some progresses under this cateogry, do you really want to delete it?";
    }

    swal({
      title: "Delete Category",
      text: text,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
    }, function(isConfirm){
      if (isConfirm) {       
        self.props.onCategoryDestroy(id);
      }
    });
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
        this.resetCategoryControl();
      }
    }
  },

  handleCategoryConfirm: function() {
    var $title = $(this.refs.categoryAddTitle.getDOMNode());
    if (this.state.mode === MODE_ADDING) {
      var e = $.Event("keypress");
      e.which = 13;
      e.target = $title[0];
      this.handleCategoryCreate(e);
    }
    this.resetCategoryControl();
  },

  handleCategoryCancel: function() {
    this.resetCategoryControl();
  },

  render: function() {
    var mode = this.state.mode;
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

    var visibleEditing = mode === MODE_EDITING ? "" : "invisible",
        hiddenEditing = mode !== MODE_EDITING ? "" : "invisible",
        visibleNormal = mode === MODE_NORMAL ? "" : "invisible",
        hiddenNormal = mode !== MODE_NORMAL ? "" : "invisible",
        visibleAdding = mode === MODE_ADDING ? "" : "invisible",
        blockEditing = mode === MODE_EDITING ? "" : "hidden";

    return (
      <div id="main-menu" className="main-menu" onClick={this.handleCategoryClick}>
        <div className="category-header">Categories</div>
        <ul className="nav nav-pills nav-stacked">
          {categories.map(function(category) {
            if (!category.system) {
              return (
                <li className="category" draggable="true" key={category.id} data-category={category.id}>
                  <span className={visibleEditing + " " + blockEditing + " glyphicon glyphicon-trash"}></span>
                  <a className={mode === MODE_EDITING ? "editing" : ""} href="#">
                    {category.title}
                    <span className={hiddenEditing + " badge"}>{category.count}</span>
                  </a>
                  <span className={blockEditing + " glyphicon glyphicon-chevron-down"}></span>
                  <span className={blockEditing + " glyphicon glyphicon-chevron-up"}></span>
                </li>
              );
            } else {
              return <li className="category active" draggable="true" key={category.id} data-category={category.id}><a href="#">{category.title}<span className="badge">{category.count}</span></a></li>;
            }
          })}
          <li className={visibleAdding + " category-title"}>
            <input ref="categoryAddTitle" type="text" className="form-control" placeholder="title" onKeyPress={this.handleCategoryCreate} />
          </li>
        </ul>
        <div className="category-dashboard row">
          <span className={hiddenNormal  + " glyphicon glyphicon-ok col-sm-3 category-control category-confirm"} onClick={this.handleCategoryConfirm}></span>
          <span className={hiddenNormal  + " glyphicon glyphicon-remove col-sm-3 category-control category-cancel"} onClick={this.handleCategoryCancel}></span>
          <span className={visibleNormal + " glyphicon glyphicon-plus col-sm-3 category-control category-add"} onClick={this.handleCategoryAdd}></span>
          <span className={visibleNormal + " glyphicon glyphicon-cog col-sm-3 category-control category-edit"} onClick={this.handleCategoryEdit}></span>
        </div>
      </div>
    );
  },

});

module.exports = CategoryList;
