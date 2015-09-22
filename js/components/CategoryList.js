var React = require("react"),
    $ = require("jquery"),
    Utils = require("../helpers/Utils"),
    Storage = require("../helpers/Storage"),
    i18n = require("../helpers/I18n"),
    swal = require("sweetalert"),
    MissionStore = require("../stores/MissionStore"),
    CategoryActions = require("../actions/CategoryActions"),
    MissionActions = require("../actions/MissionActions"),
    CategoryConstants = require("../constants/CategoryConstants");

const MODE_NORMAL  = 1,
      MODE_ADDING  = 2;

var PLACEHOLDER = document.createElement("LI");
PLACEHOLDER.classList.add("placeholder");
PLACEHOLDER.innerHTML = `<a>${i18n.getMessage("labelCategoryMove")}</a>`;

// const $PLACEHOLDER = $(`<li><a>${i18n.getMessage("labelCategoryMove")}</a></li>`).addClass("placeholder");

var CategoryList = React.createClass({

  propTypes: {
    category: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array.isRequired
  },

  componentDidMount() {
    Storage.get(['_categoryTutorial'], function(categoryTutorial){
      if (!("_categoryTutorial" in categoryTutorial && categoryTutorial._categoryTutorial === true)) {
        $(`<div class="category-tutorial">${i18n.getMessage("ttCategoryEdit")}</div>`).insertBefore(".category-dashboard");
      }
    });

    this.refs.leftMenu.getDOMNode().querySelector(`[data-category="${this.props.category.id}"]`).classList.add("active");
  },

  getInitialState() {
    return {
      mode: MODE_NORMAL
    };
  },

  componentDidUpdate() {
    var menu = this.refs.leftMenu.getDOMNode();
    var active = menu.querySelector(".active");
    var category = menu.querySelector(`[data-category="${this.props.category.id}"]`);

    if (active) {
      active.classList.remove("active");
    }
    if (!category) {
      category = menu.querySelector(`[data-category="${CategoryConstants.CATEGORY_ALLID}"]`);
    }
    category.classList.add("active");

    this.refs.popoverEdit.getDOMNode().style.display = "none";
  },

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  },

handleCategoryClick(event) {
    var targetCategory = Utils.parents(event.target, "li").dataset.category;

    if (!targetCategory || targetCategory === this.state.category) {
      return;
    }
    
    CategoryActions.switch(targetCategory);
  },

  handleCategoryDoubleClick(event) {
    var target = Utils.parents(event.target, "li"),
        popover = this.refs.popoverEdit.getDOMNode(),
        input = this.refs.popoverTitle.getDOMNode(),
        tutorial = document.querySelector(".category-tutorial");

    if (this.state.mode === MODE_ADDING || this.props.category.id === CategoryConstants.CATEGORY_ALLID) {
      return;
    }

    if (tutorial) {
      tutorial.remove(tutorial);
      Storage.set({'_categoryTutorial': true}); 
    }

    popover.style.top = (target.getBoundingClientRect().top + document.body.scrollTop - target.offsetHeight * 2) + "px";
    popover.style.display = 'block';
    input.focus();
    input.value = this.props.category.title;
  },

  handlePopoverHide(event) {
    this.refs.popoverEdit.getDOMNode().style.display = "none";
  },

  handleUpdateCateogryTitle(event) {
    var nativeEvent = event.nativeEvent,
        input = this.refs.popoverTitle.getDOMNode();

    if (nativeEvent.keyCode === 13 || nativeEvent.type === "click") {      
      var title = input.value;
      if (title.trim().length > 0) {
        CategoryActions.updateTitle(this.props.category.id, title);
        this.handlePopoverHide();
      }
    } else if (nativeEvent.keyCode === 27) {
      this.handlePopoverHide();
    }
  },

  resetCategoryControl() {
    this.refs.categoryAddTitle.getDOMNode().value = "";

    this.setState({ mode: MODE_NORMAL });
  },

  handleCategoryAdd() {
    this.refs.categoryAddTitle.getDOMNode().focus();

    this.setState({ mode: MODE_ADDING });
  },

  handleCategoryDestroy(event) {
    var self = this,
        id = this.props.category.id;

    swal({
      title: i18n.getMessage("deleteCategoryTitle"),
      text: MissionStore.getLengthByCategory(id) > 0 ? i18n.getMessage("deleteCategory") : i18n.getMessage("deleteEmptyCategory"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: i18n.getMessage("modalYes"),
      cancelButtonText: i18n.getMessage("modalNo"),
    }, function(isConfirm){
      if (isConfirm) {
        // should combine them
        MissionActions.destroyMissionByCategory(id);
        CategoryActions.destroy(id);
      }
    });
  },

  handleCategoryCreate(event) {
    if (event.which === 13) {
      var title = event.target.value;

      if (title && title.length > 0) {
        CategoryActions.create(title, this.props.categories[this.props.categories.length - 1].order + 1);
        this.resetCategoryControl();
      }
    }
  },

  handleCategoryConfirm() {
    var title = this.refs.categoryAddTitle.getDOMNode();
    if (this.state.mode === MODE_ADDING) {
      var e = $.Event("keypress");
      e.which = 13;
      e.target = title;
      this.handleCategoryCreate(e);
    }
    this.resetCategoryControl();
  },

  handleCategoryCancel() {
    this.resetCategoryControl();
  },

  handleDragOver(event) {
    var target = Utils.parents(event.target, "li");

    event.preventDefault();
    this.dragged.style.display = "none";
    if (target.classList.contains("placeholder") || target.dataset.category === CategoryConstants.CATEGORY_ALLID) {
      return;
    }
    this.over = target;

    this.over.parentNode.insertBefore(PLACEHOLDER, this.over);
  },

  handleDragStart(event) {
    this.dragged = event.currentTarget;
    event.dataTransfer.effectAllowed = 'move';
    
    // Firefox requires dataTransfer data to be set
    event.dataTransfer.setData("text/html", event.currentTarget);
  },

  handleDragEnd(event) {
    var placeholder = this.dragged.parentNode.querySelector(".placeholder"),
        from = this.dragged.dataset.category,
        to = placeholder.previousElementSibling.dataset.category;

    this.dragged.style.display = "block";
    PLACEHOLDER.remove();

    CategoryActions.updateOrder(from, to);
  },

  render() {
    var mode = this.state.mode,
        categoryList = this.props.categories,
        visibleNormal = mode === MODE_NORMAL ? "" : "ani-invisible",
        hiddenNormal = mode !== MODE_NORMAL ? "" : "ani-invisible",
        visibleAdding = mode === MODE_ADDING ? "" : "ani-invisible";

    return (
      <div ref="leftMenu" className="left-menu">
        <div className="category-header"><i className="fa fa-list" /> {i18n.getMessage("labelCategories")}</div>
        <ul className="nav nav-pills nav-stacked" onClick={this.handleCategoryClick} onDoubleClick={this.handleCategoryDoubleClick} onDragOver={this.handleDragOver}>
          {categoryList.map((function(category) {
            if (!category.system) {
              return (
                <li className="category" draggable="true" key={category.id} data-category={category.id} onDragEnd={this.handleDragEnd} onDragStart={this.handleDragStart}>
                  <a href="#">
                    <span data-role="title">{category.title}</span>
                    <span className="badge">{category.count}</span>
                  </a>
                </li>
              );
            } else {
              return <li className="category" key={category.id} data-category={category.id}><a href="#">{category.title}<span className="badge">{category.count}</span></a></li>;
            }
          }).bind(this))}
          <li className={`${visibleAdding} category-title`}>
            <input ref="categoryAddTitle" type="text" className="form-control" placeholder={i18n.getMessage("labelCategoryPlaceholder")} onKeyPress={this.handleCategoryCreate} />
          </li>
        </ul>
        <div className="category-dashboard row">
          <span className={`${hiddenNormal}  fa fa-check col-sm-3 category-control category-confirm`} onClick={this.handleCategoryConfirm}></span>
          <span className={`${visibleAdding} fa fa-times col-sm-3 category-control category-cancel`} onClick={this.handleCategoryCancel}></span>
          <span className={`${visibleNormal} fa fa-plus col-sm-3 col-sm-offset-3 category-control category-add`} onClick={this.handleCategoryAdd}></span>
        </div>
        <div ref="popoverEdit" className="popover popover-edit top">
          <div className="arrow"></div>
          <div className="popover-content">
            <input ref="popoverTitle" className="form-control" type="text" onKeyDown={this.handleUpdateCateogryTitle} />
            <i onClick={this.handlePopoverHide} className="fa fa-times" />
            <i onClick={this.handleUpdateCateogryTitle} className="fa fa-check" />
            <i onClick={this.handleCategoryDestroy} className="fa fa-trash" />
          </div>
        </div>
      </div>
    );
  },

});

module.exports = CategoryList;
