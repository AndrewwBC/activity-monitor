interface ActivitiesProps {
  id: number;
  title: string;
  url: string;
  stories: number;
  instagramReels: number;
  facebookReels: number;
  facebookStories: number;
  youtubeShorts: number;
}

let lastUrl = "";

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

async function counter(url: string, index: number) {
  if (url.includes("instagram.com/")) {
    if (url.includes("stories")) activities[index].stories += 1;
    else if (url.includes("reels")) activities[index].instagramReels += 1;
    await putHistory(activities[index]);
    return;
  }

  if (url.includes("youtube.com/shorts")) {
    console.log("entrou");
    activities[index].youtubeShorts += 1;
    await putHistory(activities[index]);
    return;
  }

  if (url.includes("facebook.com/")) {
    if (url.includes("stories")) activities[index].facebookStories += 1;
    else if (url.includes("reel")) activities[index].facebookReels += 1;
    await putHistory(activities[index]);
    return;
  }
}

function createActivity(tabId: number, url: string, title: string) {
  let cleanUrl = url.replace(/^https?:\/\/([a-zA-Z0-9.-]+)(?:\/.*)?$/, "$1");

  console.log("CLEAN URL: " + cleanUrl + url);
  activities.push({
    id: tabId,
    url: cleanUrl,
    title,
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
  async (tabId: number, changeInfo: ChangeInfoType, tab: TabType) => {
    if (isInvalidUrl(tab.url!)) return;

    const getIndexOftabIdThatAlreadyExists = activities.findIndex(
      (tabData) => tabData.id === tabId
    );

    if (changeInfo.status == "complete") {
      if (tab.url != lastUrl)
        if (getIndexOftabIdThatAlreadyExists >= 0 && tab.url) {
          lastUrl = tab.url;
          await counter(tab.url!, getIndexOftabIdThatAlreadyExists);
          return;
        }

      if (getIndexOftabIdThatAlreadyExists === -1) {
        createActivity(tab.id!, tab.url!, tab.title!);
        await postActivity(activities);
        return;
      }
    }

    console.log(activities);
  }
);

// chrome.tabs.onRemoved.addListener(
//   async (tabId: number, removeInfo: RemoveInfoType) => {
//     let indexToBeEnded = 0;
//     activities = activities.map((tab, index) => {
//       if (tab.id === tabId) {
//         tab.endDate = new Date().toISOString();
//         indexToBeEnded = index;
//       }
//       return tab;
//     });

//     await putEndDate(index);
//   }
// );

const API = "http://localhost:8080/api/v1/activity";

const postActivity = async (activities: ActivitiesProps[]) => {
  const lastIndex = activities.length - 1;

  const request = await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(activities[lastIndex]),
  });
  console.log(request);

  const response = await request.json();
  console.log(response);
  return response;
};

const putHistory = async (activity: any) => {
  console.log("history:" + activity.stories);
  const history = {
    stories: activity.stories,
    instagramReels: activity.instagramReels,
    facebookReels: activity.facebookReels,
    facebookStories: activity.facebookStories,
    youtubeShorts: activity.youtubeShorts,
  };

  const request = await fetch(API + "/" + activity.url, {
    method: "PUT",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(history),
  });
  console.log(request);

  const response = await request.json();
  console.log(response);
  return response;
};
