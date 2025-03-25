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
const tabsData = {};
var urlList = [];
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
    tabsData[tabId] = { url, title };
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (isInvalidUrl(tab.url))
        return;
    if (changeInfo.status == "complete")
        addData(tabId, tab.url, tab.title);
    console.log(tabsData);
    postData(tabsData);
});
chrome.tabs.onCreated.addListener((tab) => {
    if (isInvalidUrl(tab.url)) {
        return;
    }
    console.log("Url util");
    addData(tab.id, tab.url, tab.title);
    console.log(`Titulo: ${tab.title} e Id: ${tab.id}`);
    // getting the url in order to match the tab title
    let cleanUrl = tab.url.match(/https?:\/\/[^\/]+\/?/)[0];
    urlList.push(cleanUrl);
    postData(tabsData);
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    let tabTitle = tabsData[tabId];
    console.log(tabTitle);
    if (tabTitle)
        delete tabsData[tabId];
});
const url = "http://localhost:8080/api/v1/activity";
const postData = (tabsData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Data no postData: " + tabsData);
    const request = yield fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "Application/json",
        },
        body: JSON.stringify({ activity: tabsData }),
    });
    console.log(request);
    const response = yield request.json();
    console.log(response);
});
