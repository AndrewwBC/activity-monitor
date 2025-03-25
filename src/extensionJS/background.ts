interface ActivitiesProps {
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

let activities: ActivitiesProps[] = [];

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
    if (url.includes("stories")) activities[index].stories += 1;
    else if (url.includes("reels")) activities[index].instagramReels += 1;
    return;
  }

  if (url.includes("youtube.com/shorts")) {
    activities[index].youtubeShorts += 1;
    return;
  }

  if (url.includes("facebook.com/")) {
    if (url.includes("stories")) activities[index].facebookStories += 1;
    else if (url.includes("reel")) activities[index].facebookReels += 1;
    return;
  }
}

function createData(tabId: number, url: string, title: string) {
  let cleanUrl = url!.match(/https?:\/\/[^\/]+\/[^\/]+\/?.*/)!?.[0];
  console.log("CLEAN URL: " + cleanUrl);
  activities.push({
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

    const getIndexOftabIdThatAlreadyExists = activities.findIndex(
      (tabData) => tabData.id === tabId
    );
    console.log("Index: " + getIndexOftabIdThatAlreadyExists);
    if (changeInfo.status == "complete") {
      if (getIndexOftabIdThatAlreadyExists >= 0)
        counter(tab.url!, getIndexOftabIdThatAlreadyExists);
      if (getIndexOftabIdThatAlreadyExists === -1)
        createData(tab.id!, tab.url!, tab.title!);
    }

    console.log(activities);
  }
);

chrome.tabs.onCreated.addListener((tab: TabType) => {
  if (isInvalidUrl(tab.url!)) return;
  console.log("EVENTO DE CREATED");
  createData(tab.id!, tab.url!, tab.title!);
  postData(activities);
});

chrome.tabs.onRemoved.addListener(
  (tabId: number, removeInfo: RemoveInfoType) => {
    activities = activities.map((tab) => {
      if (tab.id === tabId) {
        tab.endDate = new Date().toISOString();
      }
      return tab;
    });
    console.log(activities);
  }
);

const url = "http://localhost:8080/api/v1/activities";

const postData = async (activities: ActivitiesProps[]) => {
  const lastIndex = activities.length - 1;

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(activities[lastIndex]),
  });
  console.log(request);

  const response = await request.json();
  console.log(response);
};
