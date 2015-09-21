/**
 * UI test, verify most features.
 * @todo helper functions
 */ 
describe('MissionBoard', function() {

  after(function() {
    show();
  });

  describe('Render', function() {
    it('should have four categories', function() {
      var categories = document.querySelectorAll("li.category");

      assert.equal(categories.length, 4);
    });

    it('should have four missions', function() {
      var list = document.querySelector(".mission-list");
      var missions = list.querySelectorAll(".panel.panel-default")

      assert.equal(missions.length, 4);
    });

    describe('Tutorial', function() {
      before(function(done) {
        setTimeout(function() {
          done();
        }, 500);
      });

      it('should show tutorial and then close it', function() {
        var tutorial = document.querySelector(".hopscotch-bubble");
        var closeButton = document.querySelector(".hopscotch-close");

        assert.notEqual(tutorial.style.display, "none");

        Helper.singleClick(closeButton);
        assert.equal(tutorial.style.display, "");
      });
    })    
  });

  describe('Category', function() {
    describe('Switch', function() {
      var active = document.querySelector(".category.active");
      var next = active.nextElementSibling;
      
      it('should remove current active category', function() {
        active = document.querySelector(".category.active");

        Helper.singleClick(next.querySelector('a'));

        assert(!active.classList.contains("active"));
      });

      it('should highlight selected category', function() {
        assert(next.classList.contains("active"));
      });

      it('should change mission numbers', function() {
        var list = document.querySelector(".mission-list");
        var missions = list.querySelectorAll(".panel.panel-default")

        assert.equal(missions.length, 1);
      });
    });

    describe('Update', function() {
      var defaultCategory = document.querySelectorAll("li.category")[0];
      var category = document.querySelectorAll("li.category")[1];
      var popover = document.querySelector(".popover-edit");

      it('should not allow edit default category', function() {
        Helper.singleClick(defaultCategory.querySelector('a'));
        Helper.dblClick(defaultCategory.querySelector('a'));

        assert.equal(popover.style.display, "none");
      });

      it('should pop up popover', function() {
        Helper.singleClick(category.querySelector('a'));
        Helper.dblClick(category.querySelector('a'));

        assert.notEqual(popover.style.display, "none");
      });

      it('should update title', function() {
        const newTitle = "MYNEWTITLE";
        var oldTitle = category.querySelector('[data-role="title"]').innerText;
        var input = popover.querySelector("input.form-control");
        var btn = popover.querySelector("i.fa-check");

        input.value = newTitle;

        Helper.singleClick(btn);

        assert.notEqual(category.querySelector('[data-role="title"]').innerText, oldTitle);
        assert.equal(category.querySelector('[data-role="title"]').innerText, newTitle);
      });
    });

    describe('Delete', function() {
      var category = document.querySelectorAll("li.category")[1];
      var popover = document.querySelector(".popover-edit");

      before(function(done) {
        var btn = popover.querySelector("i.fa-trash");

        Helper.singleClick(category.querySelector('a'));
        Helper.dblClick(category.querySelector('a'));
        Helper.singleClick(btn);

        setTimeout(function() {
          done();
        }, 500);
      });

      it('should delete the category', function() {
        var confirm = document.querySelector(".sweet-alert button.confirm");
        var oldLength = document.querySelectorAll("li.category").length;

        Helper.singleClick(confirm);
        assert.equal(oldLength - 1, document.querySelectorAll("li.category").length)
      });
    });

    describe('Create', function() {
      it('should add a new category', function() {
        const newTitle = "NEWCATEGORY"
        var addButton = document.querySelector(".category-add");
        Helper.singleClick(addButton);

        var titleInput = document.querySelector(".category-title > input");
        assert.notEqual(titleInput.style.display, "none");

        var confirm = document.querySelector(".category-confirm");
        assert.notEqual(titleInput.style.display, "none");

        titleInput.value = newTitle;
        Helper.singleClick(confirm);

        var categories = document.querySelectorAll("li.category");
        var category = categories[categories.length - 1];
        var title = category.querySelector('[data-role="title"]').innerText;

        assert.equal(title, newTitle);
      });
    });
  })

  describe('Mission', function() {
    var createInput = document.querySelector(".mission-toolbar input.input__field");
    var editForm = document.querySelector(".modal.fade");
    var missions = document.querySelectorAll(".mission-list > div.panel");

    describe('Update', function() {
      it('should update a mission', function() {
        var mission = missions[0];
        var editButton = mission.querySelector(".mission-control > .mission-edit");
        var inputs = editForm.querySelectorAll(".form-group input");
        var input = inputs[0];

        var oldTitle = mission.querySelector(".mission-title").innerText;
        var oldDesc = mission.querySelector(".mission-desc").innerText;
        var oldPercent = mission.querySelector(".mission-percentage").innerText;
        var oldCurrent = mission.querySelector(".label-mission").querySelectorAll("span")[0].innerText;
        var oldTotal = mission.querySelector(".label-mission").querySelectorAll("span")[2].innerText;

        const title = "MY NEW TITLE";
        const desc = "MY NEW DESC";
        const current = "10";
        const total = "25";
        const percent = "40%";

        // Helper.singleClick(editButton);

        // var e = $.Event("keypress");
        // e.which = 74;
        // e.target = title;

        // $(input).trigger(e);

        // console.log(input, e);

        // console.log(inputs);
        // inputs[0].value = title;

        // console.log(oldTitle, oldDesc, oldPercent, oldCurrent, oldTotal);
      });
    });

    describe('Delete', function() {
      var mission = missions[missions.length - 1];

      before(function(done) {
        var btn = mission.querySelector("i.mission-delete");

        Helper.singleClick(btn);

        setTimeout(function() {
          done();
        }, 500);
      });

      it('should delete a mission', function() {
        var confirm = document.querySelector(".sweet-alert button.confirm");
        var oldLength = missions.length;

        Helper.singleClick(confirm);
        assert.equal(oldLength - 1, document.querySelectorAll(".mission-list > div.panel").length)
      });
    });
  });

});