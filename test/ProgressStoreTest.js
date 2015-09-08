var assert = require("assert");
var sinon = require("sinon");

/**
 * Test cases for ProgressStore and ProgressActions
 */ 
describe('ProgressStore', function() {

  var ProgressStore = require("../js/stores/ProgressStore"),
      ProgressActions = require("../js/actions/ProgressActions"),
      ProgressConstants = require('../js/constants/ProgressConstants');

  before(function () {
  });

  const CATEGORY_IDS = ["1", "2", "3"];

  describe('#init()', function() {
    var persist = sinon.stub(ProgressStore, "persist");
    var clear = sinon.stub(ProgressStore, "clear");

    it('should return some ids', function(){
      var ids = ProgressStore.init(CATEGORY_IDS);

      sinon.assert.called(persist)

      assert.equal(ids.length, 5);
    });
  });

  describe('#getAll()', function() {
    it('should return all the progresses', function() {
      var progresses = ProgressStore.getAll();

      assert.equal(Object.keys(progresses).length, 5);
    });
  });

  describe('#loadProgresses()', function() {
    it('should load some progresses', function() {
      var progressesBak = ProgressStore.getAll();

      ProgressStore.loadProgresses([]);
      var progresses = ProgressStore.getAll();

      assert.equal(Object.keys(progresses).length, 0);

      ProgressStore.loadProgresses(progressesBak);
      progresses = ProgressStore.getAll();

      assert.equal(Object.keys(progresses).length, 5);
    });
  });

  describe('#getEditing() & #Action::setEditing', function() {
    it('should set/get current editing progress', function() {
      var editing = ProgressStore.getEditing();

      assert.equal(editing, null);

      ProgressActions.setEditing("1");

      assert.equal(ProgressStore.getEditing(), "1");
    });
  });

  describe('#getLengthByCategory()', function() {
    it('should return the progress count of a specific category', function() {
      var progressCount = ProgressStore.getLengthByCategory(CATEGORY_IDS[0]);

      assert.equal(progressCount, 2);
    });

    it('should return zero if the the category is missing', function() {
      var progressCount = ProgressStore.getLengthByCategory("WRONG CATEGORY");

      assert.equal(progressCount, 0);
    });
  });

  describe('#getCompleted()', function() {
    it('should return the count of completed progresses', function() {
      var completed = ProgressStore.getCompleted();

      assert.equal(completed, 1);
    });
  });

  describe('#Action::create', function() {
    it('should create a new progress', function() {
      var prevCount = Object.keys(ProgressStore.getAll()).length;
      ProgressActions.create("TITLE", 1, 2, CATEGORY_IDS[0], null, "");

      assert.equal(Object.keys(ProgressStore.getAll()).length, prevCount + 1);
    });

    it('should failed when title is empty', function() {
      var prevCount = Object.keys(ProgressStore.getAll()).length;
      ProgressActions.create("", 1, 2, CATEGORY_IDS[0], null, "");

      assert.equal(Object.keys(ProgressStore.getAll()).length, prevCount);
    });
  });

  describe('#Action::destroy', function() {
    it('should destroy a progress', function() {
      var id = Object.keys(ProgressStore.getAll())[0];
      var prevCount = Object.keys(ProgressStore.getAll()).length;

      ProgressActions.destroy(id);

      assert.equal(Object.keys(ProgressStore.getAll()).length, prevCount - 1);
      assert.notEqual(Object.keys(ProgressStore.getAll())[0], id);
    });
  });

  describe('#Action::destroyProgressByCategory', function() {
    it('should destroy all progresses belongs to a specific category', function() {
      assert.notEqual(ProgressStore.getLengthByCategory(CATEGORY_IDS[1]), 0);

      ProgressActions.destroyProgressByCategory(CATEGORY_IDS[1]);

      assert.equal(ProgressStore.getLengthByCategory(CATEGORY_IDS[1]), 0);
    });
  });

  describe('#Action::update', function() {
    it('should update a specific progress', function() {
      const title = "NEW TITLE";
      const current = 33;
      const total = 45;
      const category = "NEW CATEGORY";
      const description = "NEW DESCRIPTION";

      var id = Object.keys(ProgressStore.getAll())[0];
      var progress = ProgressStore.getAll()[id];
      var oldCreatedAt = progress.createdAt;

      ProgressActions.update(progress.id, title, current, total, category, null, description);

      progress = ProgressStore.getAll()[id];
      assert.equal(progress.title, title);
      assert.equal(progress.current, current);
      assert.equal(progress.total, total);
      assert.equal(progress.category, category);
      assert.equal(progress.description, description);
      assert.equal(progress.createdAt, oldCreatedAt);
    });
  });

   describe('#Action::updateProgress', function() {
    it('should update the progress of a specific progress', function() {
      const current = 77;
      var id = Object.keys(ProgressStore.getAll())[0];

      ProgressActions.updateProgress(id, current);

      var progress = ProgressStore.getAll()[id];
      assert.equal(progress.current, current);
    });
  });

})