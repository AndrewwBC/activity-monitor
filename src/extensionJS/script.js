let titlesList = document.getElementById("titlesList");
var urlList = [];
var openTabs = [];

let tabsIds = {};

chrome.tabs.onCreated.addListener({}, (tab) => {
  tabsIds[tab.title] = tab.id;
  console.log(tab.title);

  let listItem = document.createElement("li");
  listItem.textContent = tab.title;
  titlesList.appendChild(listItem);

  // getting the url in order to match the tab title
  let cleanUrl = tab.url.match(/https?:\/\/[^\/]+\/?/)[0];
  openTabs.push(tab.title);
  urlList.push(cleanUrl);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  let tabTitle = openTabs[tabId];

  if (tabTitle) openTabs = openTabs.filter((tab) => tab !== tabTitle);
});

chrome.tabs.onRemove;
