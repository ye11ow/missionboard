chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('../index.html', {
    id: 'main',
    bounds: { width: 1280, height: 800 },
    minWidth: 1200,
    minHeight: 600
  });
});