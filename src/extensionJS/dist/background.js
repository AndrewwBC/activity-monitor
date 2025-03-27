"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let lastUrl = "";
let activities = [];
function isInvalidUrl(url) {
    console.log(url);
    const invalidUrls = [
        "",
        "about:blank",
        "chrome://newtab/",
        "chrome://extensions",
    ];
    if (invalidUrls.some((invalidUrl) => invalidUrl == url) || url == undefined)
        return true;
    else
        return false;
}
function counter(url, index) {
    return __awaiter(this, void 0, void 0, function* () {
        if (url.includes("instagram.com/")) {
            if (url.includes("stories"))
                activities[index].stories += 1;
            else if (url.includes("reels"))
                activities[index].instagramReels += 1;
            yield putHistory(activities[index]);
            return;
        }
        if (url.includes("youtube.com/shorts")) {
            console.log("entrou");
            activities[index].youtubeShorts += 1;
            yield putHistory(activities[index]);
            return;
        }
        if (url.includes("facebook.com/")) {
            if (url.includes("stories"))
                activities[index].facebookStories += 1;
            else if (url.includes("reel"))
                activities[index].facebookReels += 1;
            yield putHistory(activities[index]);
            return;
        }
    });
}
function createActivity(tabId, url, title) {
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
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => __awaiter(void 0, void 0, void 0, function* () {
    if (isInvalidUrl(tab.url))
        return;
    const getIndexOftabIdThatAlreadyExists = activities.findIndex((tabData) => tabData.id === tabId);
    if (changeInfo.status == "complete") {
        if (tab.url != lastUrl)
            if (getIndexOftabIdThatAlreadyExists >= 0 && tab.url) {
                lastUrl = tab.url;
                yield counter(tab.url, getIndexOftabIdThatAlreadyExists);
                return;
            }
        if (getIndexOftabIdThatAlreadyExists === -1) {
            createActivity(tab.id, tab.url, tab.title);
            yield postActivity(activities);
            return;
        }
    }
    console.log(activities);
}));
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
const postActivity = (activities) => __awaiter(void 0, void 0, void 0, function* () {
    const lastIndex = activities.length - 1;
    const request = yield fetch(API, {
        method: "POST",
        headers: {
            "Content-type": "Application/json",
        },
        body: JSON.stringify(activities[lastIndex]),
    });
    console.log(request);
    const response = yield request.json();
    console.log(response);
    return response;
});
const putHistory = (activity) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("history:" + activity.stories);
    const history = {
        stories: activity.stories,
        instagramReels: activity.instagramReels,
        facebookReels: activity.facebookReels,
        facebookStories: activity.facebookStories,
        youtubeShorts: activity.youtubeShorts,
    };
    const request = yield fetch(API + "/" + activity.url, {
        method: "PUT",
        headers: {
            "Content-type": "Application/json",
        },
        body: JSON.stringify(history),
    });
    console.log(request);
    const response = yield request.json();
    console.log(response);
    return response;
});
