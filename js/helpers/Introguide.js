(function(){
  var startIntro = function() {
    var tour = {
      id: "hello-hopscotch",
      showPrevButton: true,

      steps: [
        {
          title: chrome.i18n.getMessage("ttWelcomeTitle"),
          content: chrome.i18n.getMessage("ttWelcomeText"),
          target: ".navbar-brand",
          placement: "bottom"
        },
        {
          title: chrome.i18n.getMessage("ttCategoryTitle"),
          content: chrome.i18n.getMessage("ttCategoryText"),
          target: ".nav.nav-pills.nav-stacked",
          placement: "right"
        },
        {
          title: chrome.i18n.getMessage("ttMissionTitle"),
          content: chrome.i18n.getMessage("ttMissionText"),
          target: ".progress-list",
          placement: "top"
        },
        {
          title: chrome.i18n.getMessage("ttCreateMissionTitle"),
          content: chrome.i18n.getMessage("ttCreateMissionText"),
          target: ".input.input--hoshi",
          placement: "bottom"
        },
        {
          title: chrome.i18n.getMessage("ttFilterTitle"),
          content: chrome.i18n.getMessage("ttFilterText"),
          target: ".progress-filter",
          placement: "left"
        },

      ]

    };

    hopscotch.startTour(tour);
  }

  module.exports.startIntro = startIntro;
}())
