interface TabsDataProps {
  title: string;
  url: string;
  creationDate?: string;
  endDate?: string;
}

type TabsDataType = Record<number, TabsDataProps>;

const tabsData: TabsDataType = {};

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
  let cleanUrl = url!.match(/https?:\/\/[^\/]+\/?/)![0];

  tabsData[tabId] = { url: cleanUrl, title };
}

type ChangeInfoType = chrome.tabs.TabChangeInfo;
type TabType = chrome.tabs.Tab;
type RemoveInfoType = chrome.tabs.TabRemoveInfo;

chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: ChangeInfoType, tab: TabType) => {
    if (isInvalidUrl(tab.url!)) return;

    if (changeInfo.status == "complete") addData(tabId, tab.url!, tab.title!);
    console.log(tabsData);
    postData(tabsData);
  }
);

chrome.tabs.onCreated.addListener((tab: TabType) => {
  if (isInvalidUrl(tab.url!)) return;

  addData(tab.id!, tab.url!, tab.title!);
  postData(tabsData);
});

chrome.tabs.onRemoved.addListener(
  (tabId: number, removeInfo: RemoveInfoType) => {
    let tabTitle = tabsData[tabId];
    console.log(tabTitle);

    if (tabTitle) delete tabsData[tabId];
  }
);

const url = "http://localhost:8080/api/v1/activity";

const postData = async (tabsData: TabsDataType) => {
  console.log("Data no postData: " + tabsData);
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify({ activity: tabsData }),
  });
  console.log(request);

  const response = await request.json();
  console.log(response);
};
