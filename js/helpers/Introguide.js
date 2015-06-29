var hopscotch = require("hopscotch"),
    i18n = require("./I18n");

(function(){
  var startIntro = function() {
    var tour = {
      id: "hello-hopscotch",
      showPrevButton: true,

      steps: [
        {
          title: i18n.getMessage("ttWelcomeTitle"),
          content: i18n.getMessage("ttWelcomeText"),
          target: ".navbar-brand",
          placement: "bottom"
        },
        {
          title: i18n.getMessage("ttCategoryTitle"),
          content: i18n.getMessage("ttCategoryText"),
          target: ".nav.nav-pills.nav-stacked",
          placement: "right"
        },
        {
          title: i18n.getMessage("ttMissionTitle"),
          content: i18n.getMessage("ttMissionText"),
          target: ".progress-list",
          placement: "top"
        },
        {
          title: i18n.getMessage("ttCreateMissionTitle"),
          content: i18n.getMessage("ttCreateMissionText"),
          target: ".input.input--hoshi",
          placement: "bottom"
        },
        {
          title: i18n.getMessage("ttFilterTitle"),
          content: i18n.getMessage("ttFilterText"),
          target: ".progress-filter",
          placement: "left"
        },

      ]

    };

    hopscotch.startTour(tour);
  }

  module.exports.startIntro = startIntro;
}())
