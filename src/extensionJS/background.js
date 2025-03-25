var tabsIdsAndTitles = {};
var urlList = [];

function isInvalidUrl(url) {
  console.log(url);
  const invalidUrls = [
    "",
    "about:blank",
    "chrome://newtab",
    "chrome://extensions",
  ];

  if (invalidUrls.includes(url) || url == undefined) return true;
  else return false;
}

chrome.tabs.onUpdated.addListener((tabid, changeInfo, tab) => {
  console.log(tabid, tab, changeInfo);
  if (isInvalidUrl(tab.url)) return;
  tabsIdsAndTitles[tab.id] = tab.title;
  console.log("Url util");
});

chrome.tabs.onCreated.addListener((tabid, changeInfo, tab) => {
  console.log(tabid, tab, changeInfo);
  if (isInvalidUrl(tab.url)) {
    return;
  }

  tabsIdsAndTitles[tab.id] = tab.title;

  console.log(`Titulo: ${tab.title} e Id: ${tab.id}`);

  // getting the url in order to match the tab title
  let cleanUrl = tab.url.match(/https?:\/\/[^\/]+\/?/)[0];

  urlList.push(cleanUrl);
});

chrome.tabs.onRemoved.addListener((tabId, changeInfo, tab) => {
  if (isInvalidUrl(tab.url)) {
    return;
  }
  let tabTitle = tabsIdsAndTitles[tabId];
  console.log(tabTitle);

  if (tabTitle) delete tabsIdsAndTitles[tabId];
});
