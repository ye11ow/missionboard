describe('MissionBoard', function() {

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
  });

  describe('Switch category', function() {
    var active = document.querySelector(".category.active");
    var next = active.nextElementSibling;
    
    it('should remove current active category', function() {
      active = document.querySelector(".category.active");

      var event = document.createEvent('HTMLEvents');
      event.initEvent('click', true, false);
      next.querySelector('a').dispatchEvent(event);

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

  describe('Edit category', function() {
    var defaultCategory = document.querySelectorAll("li.category")[0];
    var category = document.querySelectorAll("li.category")[1];
    var popover = document.querySelector(".popover-edit");
    var singleClick = document.createEvent('HTMLEvents');
    var dblClick = document.createEvent('HTMLEvents');

    singleClick.initEvent('click', true, false);
    dblClick.initEvent('dblclick', true, false);

    it('should not allow edit default category', function() {
      defaultCategory.querySelector('a').dispatchEvent(singleClick);
      defaultCategory.querySelector('a').dispatchEvent(dblClick);

      assert.equal(popover.style.display, "none");
    });

    it('should pop up popover', function() {
      category.querySelector('a').dispatchEvent(singleClick);
      category.querySelector('a').dispatchEvent(dblClick);

      assert.notEqual(popover.style.display, "none");
    });

    it('should update title', function() {
      const newTitle = "MYNEWTITLE";
      var oldTitle = category.querySelector('[data-role="title"]').innerText;
      var input = popover.querySelector("input.form-control");
      var btn = popover.querySelector("i.fa-check");

      input.value = newTitle;

      btn.dispatchEvent(singleClick);

      assert.notEqual(category.querySelector('[data-role="title"]').innerText, oldTitle);
      assert.equal(category.querySelector('[data-role="title"]').innerText, newTitle);
    });
  });

  describe('Delete category', function() {
    var category = document.querySelectorAll("li.category")[1];
    var popover = document.querySelector(".popover-edit");
    var singleClick = document.createEvent('HTMLEvents');
    var dblClick = document.createEvent('HTMLEvents');

    singleClick.initEvent('click', true, false);
    dblClick.initEvent('dblclick', true, false);

    it('should delete the category', function() {
      var oldLength = document.querySelectorAll("li.category").length;
      var btn = popover.querySelector("i.fa-trash");

      category.querySelector('a').dispatchEvent(singleClick);
      category.querySelector('a').dispatchEvent(dblClick);
      btn.dispatchEvent(singleClick);

      var confirm = document.querySelector(".sweet-alert button.confirm");

      confirm.dispatchEvent(singleClick);

      assert.equal(oldLength - 1, document.querySelectorAll("li.category").length)

      console.log(confirm);
    });

  });


});