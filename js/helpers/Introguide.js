
(function(){
  var startIntro = function() {
    var tour = {
      id: "hello-hopscotch",
      showPrevButton: true,

      steps: [
        {
          title: "Welcome",
          content: "Welcome to MissionBoard! Here is a one-minute guide to walk you around :)",
          target: ".navbar-brand",
          placement: "bottom"
        },
        {
          title: "Missions list",
          content: "List of all your missions.",
          target: "#progress-list",
          placement: "bottom"
        },
        {
          title: "Create a new Mission",
          content: "Create a new mission by entering its title here",
          target: ".input.input--hoshi",
          placement: "bottom"
        },
        {
          title: "Filter and sort",
          content: "Filter and sort Missions",
          target: "#progress-filter",
          placement: "left"
        },
        {
          title: "Category List",
          content: "List of your Cateogries",
          target: ".nav.nav-pills.nav-stacked",
          placement: "right"
        },
        {
          title: "Category control",
          content: "Add/Edit/Reorder your Categories",
          target: ".category-dashboard",
          placement: "right"
        }
      ]

    };

    hopscotch.startTour(tour);
  }

  module.exports.startIntro = startIntro;
}())
