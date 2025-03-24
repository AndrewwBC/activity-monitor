chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({}, function (tabs) {
    let titles = tabs.map((tab) => tab.title);
    console.log(titles);
  });
});
