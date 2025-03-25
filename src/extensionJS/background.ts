interface TabsDataProps {
  title?: string;
  url?: string;
}

type TabsDataType = Record<number, TabsDataProps>;

const tabsData: TabsDataType = {};

var urlList = [];

function isInvalidUrl(url: string) {
  console.log(url);
  const invalidUrls: string[] = [
    "",
    "about:blank",
    "chrome://newtab/",
    "chrome://extensions",
  ];

  if (invalidUrls.some((invalidUrl) => invalidUrl == url) || url == undefined)
    return true;
  else return false;
}

function addData(tabId: number, url: string, title: string) {
  tabsData[tabId] = { url, title };
}

type ChangeInfoType = chrome.tabs.TabChangeInfo;
type TabType = chrome.tabs.Tab;
type RemoveInfoType = chrome.tabs.TabRemoveInfo;

chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: ChangeInfoType, tab: TabType) => {
    if (isInvalidUrl(tab.url!)) return;

    if (changeInfo.status == "complete") addData(tabId, tab.url!, tab.title!);
    console.log(tabsData);
  }
);

chrome.tabs.onCreated.addListener((tab: TabType) => {
  if (isInvalidUrl(tab.url!)) {
    return;
  }
  console.log("Url util");

  addData(tab.id!, tab.url!, tab.title!);

  console.log(`Titulo: ${tab.title} e Id: ${tab.id}`);

  // getting the url in order to match the tab title
  let cleanUrl = tab.url!.match(/https?:\/\/[^\/]+\/?/)![0];

  urlList.push(cleanUrl);
});

chrome.tabs.onRemoved.addListener(
  (tabId: number, removeInfo: RemoveInfoType) => {
    let tabTitle = tabsData[tabId];
    console.log(tabTitle);

    if (tabTitle) delete tabsData[tabId];
  }
);
