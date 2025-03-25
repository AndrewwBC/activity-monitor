interface ActivityProps {
  id: number;
  title: string;
  url: string;
  creationDate?: string;
  endDate?: string | null;
  stories: number;
  instagramReels: number;
  facebookReels: number;
  facebookStories: number;
  youtubeShorts: number;
}

let activity: ActivityProps[] = [];

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

function counter(url: string, index: number) {
  if (url.includes("instagram.com/")) {
    if (url.includes("stories")) activity[index].stories += 1;
    else if (url.includes("reels")) activity[index].instagramReels += 1;
    return;
  }

  if (url.includes("youtube.com/shorts")) {
    activity[index].youtubeShorts += 1;
    return;
  }

  if (url.includes("facebook.com/")) {
    if (url.includes("stories")) activity[index].facebookStories += 1;
    else if (url.includes("reel")) activity[index].facebookReels += 1;
    return;
  }
}

function createData(tabId: number, url: string, title: string) {
  let cleanUrl = url!.match(/https?:\/\/[^\/]+\/[^\/]+\/?/)![0];

  activity.push({
    id: tabId,
    url: cleanUrl,
    title,
    creationDate: new Date().toISOString(),
    endDate: null,
    stories: 0,
    facebookReels: 0,
    facebookStories: 0,
    instagramReels: 0,
    youtubeShorts: 0,
  });
}

type ChangeInfoType = chrome.tabs.TabChangeInfo;
type TabType = chrome.tabs.Tab;
type RemoveInfoType = chrome.tabs.TabRemoveInfo;

chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: ChangeInfoType, tab: TabType) => {
    if (isInvalidUrl(tab.url!)) return;

    const getIndexOftabIdThatAlreadyExists = activity.findIndex(
      (tabData) => tabData.id === tabId
    );

    if (changeInfo.status == "complete")
      createData(tabId, tab.url!, tab.title!);
    console.log(activity);
  }
);

chrome.tabs.onCreated.addListener((tab: TabType) => {
  if (isInvalidUrl(tab.url!)) return;
  console.log("EVENTO DE CREATED");
  createData(tab.id!, tab.url!, tab.title!);
  postData(activity);
});

chrome.tabs.onRemoved.addListener(
  (tabId: number, removeInfo: RemoveInfoType) => {
    activity = activity.map((tab) => {
      if (tab.id === tabId) {
        tab.endDate = new Date().toISOString();
      }
      return tab;
    });
    console.log(activity);
  }
);

const url = "http://localhost:8080/api/v1/activity";

const postData = async (activity: ActivityProps[]) => {
  const lastIndex = activity.length - 1;

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(activity[lastIndex]),
  });
  console.log(request);

  const response = await request.json();
  console.log(response);
};
