var Helper = {
  singleClick: function(target) {
    var singleClick = document.createEvent('HTMLEvents');
    singleClick.initEvent('click', true, false);
    target.dispatchEvent(singleClick);
  },
  dblClick: function(target) {
    var dblClick = document.createEvent('HTMLEvents');
    dblClick.initEvent('dblclick', true, false);
    target.dispatchEvent(dblClick);
  }
};