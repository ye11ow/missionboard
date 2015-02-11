var React = require('react'),
    ProgressStore = require('../stores/ProgressStore'),
    CategoryActions = require('../actions/CategoryActions'),
    CategoryConstants = require('../constants/CategoryConstants');

var MODE_NORMAL  = 1,
    MODE_ADDING  = 2,
    MODE_EDITING = 3;

var $placeholder = $("<li><a>Drop here</a></li>").addClass("placeholder");

function sortCategory(cA, cB) {
  return cA.order - cB.order;
}

var CategoryList = React.createClass({

  componentDidMount: function() {
    $("#main-menu").on("click", ".fa-trash", this.handleCategoryDestroy);
  },

  getInitialState: function() {
    return {
      mode: MODE_NORMAL
    };
  },

  handleCategoryClick: function(event) {
    var $target = $(event.target),
        targetCategory = $(event.target).parents("li").attr("data-category");

    if (!targetCategory || targetCategory === this.state.category) {
      return;
    }

    var $category = $("#main-menu"),
        $target = $(event.target).parents("li");

    $category.find(".active").removeClass("active");
    $target.addClass("active");

    this.props.onCategorySwitch(targetCategory);
  },

  handleCategoryDoubleClick: function() {
    var $target = $(event.target);

    if (this.state.mode !== MODE_NORMAL || $target.attr("data-role") !== "title") {
      return;
    }

    $target.prop("contenteditable", "true");
    $target.focus();
  },

  handleUpdateCateogryTitle: function(event) {
    var nativeEvent = event.nativeEvent;

    if (nativeEvent.charCode === 13) {
      event.preventDefault();
      $target = $(nativeEvent.target);
      $target.blur();
      $target.prop("contenteditable", false);

      var category = $target.parent().parent().attr("data-category"),
          title = $target.text();

      CategoryActions.updateTitle(category, title);
    }
  },

  resetCategoryControl: function() {
    var $title = $(this.refs.categoryAddTitle.getDOMNode());
    $title.val("");

    this.setState({ mode: MODE_NORMAL });
  },

  handleCategoryAdd: function() {
    var $title = $(this.refs.categoryAddTitle.getDOMNode());
    $title.focus();

    this.setState({ mode: MODE_ADDING });
  },

  handleCategoryEdit: function() {
    this.setState({ mode: MODE_EDITING });
  },

  handleCategoryDestroy: function(event) {
    event.preventDefault();
    event.stopPropagation();
    var self = this,
        $target = $(event.target).parent(),
        id = $target.attr("data-category"),
        text = chrome.i18n.getMessage("deleteEmptyCategory");

    if (ProgressStore.getLengthByCategory(id) > 0 ) {
      text = chrome.i18n.getMessage("deleteCategory");
    }

    swal({
      title: chrome.i18n.getMessage("deleteCategoryTitle"),
      text: text,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: chrome.i18n.getMessage("modalYes"),
      cancelButtonText: chrome.i18n.getMessage("modalNo"),
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

  handleDragOver: function(event) {
    var $target = $(event.target).parent("li");

    event.preventDefault();
    this.dragged.hide();
    if ($target.hasClass("placeholder") || $target.attr("data-category") === CategoryConstants.CATEGORY_ALLID) return;
    this.over = $target;
    $placeholder.insertBefore(this.over);
  },

  handleDragStart: function(event) {
    this.dragged = $(event.currentTarget);
    event.dataTransfer.effectAllowed = 'move';
    
    // Firefox requires dataTransfer data to be set
    event.dataTransfer.setData("text/html", event.currentTarget);
  },

  handleDragEnd: function(event) {
    var from = this.dragged.attr("data-category"),
        to = this.dragged.parent().find(".placeholder").prev().attr("data-category");

    this.dragged.show();
    this.dragged.parent().find(".placeholder").remove();

    CategoryActions.updateOrder(from, to);
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

    var visibleEditing = mode === MODE_EDITING ? "" : "ani-invisible",
        hiddenEditing = mode !== MODE_EDITING ? "" : "ani-invisible",
        visibleNormal = mode === MODE_NORMAL ? "" : "ani-invisible",
        hiddenNormal = mode !== MODE_NORMAL ? "" : "ani-invisible",
        visibleAdding = mode === MODE_ADDING ? "" : "ani-invisible",
        blockEditing = mode === MODE_EDITING ? "" : "hidden";

    return (
      <div id="main-menu" className="main-menu" onClick={this.handleCategoryClick}>
        <div className="category-header"><i className="fa fa-list" /> {chrome.i18n.getMessage("labelCategories")}</div>
        <ul className="nav nav-pills nav-stacked" onDoubleClick={this.handleCategoryDoubleClick} onKeyPress={this.handleUpdateCateogryTitle} onDragOver={this.handleDragOver}>
          {categories.map((function(category) {
            if (!category.system) {
              return (
                <li className="category" draggable="true" key={category.id} data-category={category.id} onDragEnd={this.handleDragEnd} onDragStart={this.handleDragStart}>
                  <span className={visibleEditing + " " + blockEditing + " fa fa-trash"}></span>
                  <a className={mode === MODE_EDITING ? "editing" : ""} href="#">
                    <span data-role="title">{category.title}</span>
                    <span className={hiddenEditing + " badge"} >{category.count}</span>
                  </a>
                </li>
              );
            } else {
              return <li className="category active" key={category.id} data-category={category.id}><a href="#">{category.title}<span className="badge">{category.count}</span></a></li>;
            }
          }).bind(this))}
          <li className={visibleAdding + " category-title"}>
            <input ref="categoryAddTitle" type="text" className="form-control" placeholder={chrome.i18n.getMessage("labelCategoryPlaceholder")} onKeyPress={this.handleCategoryCreate} />
          </li>
        </ul>
        <div className="category-dashboard row">
          <span className={hiddenNormal  + " fa fa-check col-sm-3 category-control category-confirm"} onClick={this.handleCategoryConfirm}></span>
          <span className={visibleAdding + " fa fa-times col-sm-3 category-control category-cancel"} onClick={this.handleCategoryCancel}></span>
          <span className={visibleNormal + " fa fa-plus col-sm-3 category-control category-add"} onClick={this.handleCategoryAdd}></span>
          <span className={visibleNormal + " fa fa-edit col-sm-3 category-control category-edit"} onClick={this.handleCategoryEdit}></span>
        </div>
      </div>
    );
  },

});

module.exports = CategoryList;
