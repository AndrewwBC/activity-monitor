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
let tabsData = [];
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
function addData(tabId, url, title) {
    let cleanUrl = url.match(/https?:\/\/[^\/]+\/[^\/]+\/?/)[0];
    tabsData.push({
        id: tabId,
        url: cleanUrl,
        title,
        creationDate: new Date().toISOString(),
        endDate: null,
        updates: 0,
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
    const getIndexOftabIdThatAlreadyExists = tabsData.findIndex((tabData) => tabData.id === tabId);
    if (changeInfo.status == "complete")
        addData(tabId, tab.url, tab.title);
    console.log(tabsData);
});
chrome.tabs.onCreated.addListener((tab) => {
    if (isInvalidUrl(tab.url))
        return;
    console.log("EVENTO DE CREATED");
    addData(tab.id, tab.url, tab.title);
    postData(tabsData);
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    tabsData = tabsData.map((tab) => {
        if (tab.id === tabId) {
            tab.endDate = new Date().toISOString();
        }
        return tab;
    });
    console.log(tabsData);
});
const url = "http://localhost:8080/api/v1/activity";
const postData = (tabsData) => __awaiter(void 0, void 0, void 0, function* () {
    const lastIndex = tabsData.length - 1;
    const request = yield fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "Application/json",
        },
        body: JSON.stringify(tabsData[lastIndex]),
    });
    console.log(request);
    const response = yield request.json();
    console.log(response);
});
