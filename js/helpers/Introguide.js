
(function(){
  var startIntro = function() {
    var intro = introJs();
    intro.setOptions({
      steps: [
        { 
          intro: "Welcome to MissionBoard! Here is a one-minute guide to walk you around :)"
        },
        {
          element: $("#progress-list")[0],
          intro: "List of all your missions.",
          position: 'bottom'
        },
        {
          element: $('.progress-toolbar input[type="text"]')[0],
          intro: "Create a new mission by entering its title here"
        },
        {
          element: $(".progress-filter")[0],
          intro: 'Filter missions',
        },
        {
          element: $(".progress-orderby")[0],
          intro: 'Sort missions',
        },
        {
          element: $(".nav.nav-pills.nav-stacked")[0],
          intro: 'All categories',
          position: 'right'
        },
        {
          element: $(".category-dashboard")[0],
          intro: 'Add/Edit category',
          position: 'right'
        }
      ]
    });

    intro.start();
  }

  module.exports.startIntro = startIntro;
}())
