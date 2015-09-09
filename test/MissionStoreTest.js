var assert = require("assert");
var sinon = require("sinon");

/**
 * Test cases for MissionStore and MissionActions
 */ 
describe('MissionStore', function() {

  var MissionStore = require("../js/stores/MissionStore"),
      MissionActions = require("../js/actions/MissionActions"),
      MissionConstants = require('../js/constants/MissionConstants');

  before(function () {
  });

  const CATEGORY_IDS = ["1", "2", "3"];

  describe('#init()', function() {
    var persist = sinon.stub(MissionStore, "persist");
    var clear = sinon.stub(MissionStore, "clear");

    it('should return some ids', function(){
      var ids = MissionStore.init(CATEGORY_IDS);

      sinon.assert.called(persist)

      assert.equal(ids.length, 5);
    });
  });

  describe('#getAll()', function() {
    it('should return all the missions', function() {
      var missions = MissionStore.getAll();

      assert.equal(Object.keys(missions).length, 5);
    });
  });

  describe('#loadMissions()', function() {
    it('should load some missions', function() {
      var missionsBak = MissionStore.getAll();

      MissionStore.loadMissions([]);
      var missions = MissionStore.getAll();

      assert.equal(Object.keys(missions).length, 0);

      MissionStore.loadMissions(missionsBak);
      missions = MissionStore.getAll();

      assert.equal(Object.keys(missions).length, 5);
    });
  });

  describe('#getEditing() & #Action::setEditing', function() {
    it('should set/get current editing mission', function() {
      var editing = MissionStore.getEditing();

      assert.equal(editing, null);

      MissionActions.setEditing("1");

      assert.equal(MissionStore.getEditing(), "1");
    });
  });

  describe('#getLengthByCategory()', function() {
    it('should return the mission count of a specific category', function() {
      var missionCount = MissionStore.getLengthByCategory(CATEGORY_IDS[0]);

      assert.equal(missionCount, 2);
    });

    it('should return zero if the the category is missing', function() {
      var missionCount = MissionStore.getLengthByCategory("WRONG CATEGORY");

      assert.equal(missionCount, 0);
    });
  });

  describe('#getCompleted()', function() {
    it('should return the count of completed missions', function() {
      var completed = MissionStore.getCompleted();

      assert.equal(completed, 1);
    });
  });

  describe('#Action::create', function() {
    it('should create a new mission', function() {
      var prevCount = Object.keys(MissionStore.getAll()).length;
      MissionActions.create("TITLE", 1, 2, CATEGORY_IDS[0], null, "");

      assert.equal(Object.keys(MissionStore.getAll()).length, prevCount + 1);
    });

    it('should failed when title is empty', function() {
      var prevCount = Object.keys(MissionStore.getAll()).length;
      MissionActions.create("", 1, 2, CATEGORY_IDS[0], null, "");

      assert.equal(Object.keys(MissionStore.getAll()).length, prevCount);
    });
  });

  describe('#Action::destroy', function() {
    it('should destroy a mission', function() {
      var id = Object.keys(MissionStore.getAll())[0];
      var prevCount = Object.keys(MissionStore.getAll()).length;

      MissionActions.destroy(id);

      assert.equal(Object.keys(MissionStore.getAll()).length, prevCount - 1);
      assert.notEqual(Object.keys(MissionStore.getAll())[0], id);
    });
  });

  describe('#Action::destroyMissionByCategory', function() {
    it('should destroy all missions belongs to a specific category', function() {
      assert.notEqual(MissionStore.getLengthByCategory(CATEGORY_IDS[1]), 0);

      MissionActions.destroyMissionByCategory(CATEGORY_IDS[1]);

      assert.equal(MissionStore.getLengthByCategory(CATEGORY_IDS[1]), 0);
    });
  });

  describe('#Action::update', function() {
    it('should update a specific mission', function() {
      const title = "NEW TITLE";
      const current = 33;
      const total = 45;
      const category = "NEW CATEGORY";
      const description = "NEW DESCRIPTION";

      var id = Object.keys(MissionStore.getAll())[0];
      var mission = MissionStore.getAll()[id];
      var oldCreatedAt = mission.createdAt;

      MissionActions.update(mission.id, title, current, total, category, null, description);

      mission = MissionStore.getAll()[id];
      assert.equal(mission.title, title);
      assert.equal(mission.current, current);
      assert.equal(mission.total, total);
      assert.equal(mission.category, category);
      assert.equal(mission.description, description);
      assert.equal(mission.createdAt, oldCreatedAt);
    });
  });

   describe('#Action::updateMission', function() {
    it('should update the mission of a specific mission', function() {
      const current = 77;
      var id = Object.keys(MissionStore.getAll())[0];

      MissionActions.updateMission(id, current);

      var mission = MissionStore.getAll()[id];
      assert.equal(mission.current, current);
    });
  });

})