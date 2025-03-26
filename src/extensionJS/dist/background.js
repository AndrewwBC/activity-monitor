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
    if (url.includes("instagram.com/")) {
        if (url.includes("stories"))
            activities[index].stories += 1;
        else if (url.includes("reels"))
            activities[index].instagramReels += 1;
        return;
    }
    if (url.includes("youtube.com/shorts")) {
        activities[index].youtubeShorts += 1;
        return;
    }
    if (url.includes("facebook.com/")) {
        if (url.includes("stories"))
            activities[index].facebookStories += 1;
        else if (url.includes("reel"))
            activities[index].facebookReels += 1;
        return;
    }
}
function createData(tabId, url, title) {
    var _a;
    let cleanUrl = (_a = url.match(/https?:\/\/[^\/]+\/[^\/]+\/?.*/)) === null || _a === void 0 ? void 0 : _a[0];
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
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (isInvalidUrl(tab.url))
        return;
    const getIndexOftabIdThatAlreadyExists = activities.findIndex((tabData) => tabData.id === tabId);
    if (changeInfo.status == "complete") {
        if (getIndexOftabIdThatAlreadyExists >= 0)
            counter(tab.url, getIndexOftabIdThatAlreadyExists);
        if (getIndexOftabIdThatAlreadyExists === -1)
            createData(tab.id, tab.url, tab.title);
    }
    console.log(activities);
});
chrome.tabs.onCreated.addListener((tab) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(tab.status);
    console.log(tab.url);
    if (tab.status === "complete") {
        if (isInvalidUrl(tab.url))
            return;
        console.log("EVENTO DE CREATED");
        createData(tab.id, tab.url, tab.title);
        yield postData(activities);
    }
}));
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    activities = activities.map((tab) => {
        if (tab.id === tabId) {
            tab.endDate = new Date().toISOString();
        }
        return tab;
    });
    console.log(activities);
});
const url = "http://localhost:8080/api/v1/activity";
const postData = (activities) => __awaiter(void 0, void 0, void 0, function* () {
    const lastIndex = activities.length - 1;
    const request = yield fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "Application/json",
        },
        body: JSON.stringify(activities[lastIndex]),
    });
    console.log(request);
    const response = yield request.json();
    console.log(response);
});
