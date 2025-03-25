"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
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
    console.log(api_1.url);
    if (isInvalidUrl(tab.url))
        return;
    if (changeInfo.status == "complete")
        addData(tabId, tab.url, tab.title);
    console.log(tabsData);
});
chrome.tabs.onCreated.addListener((tab) => {
    if (isInvalidUrl(tab.url)) {
        return;
    }
    console.log("Url util");
    console.log(api_1.url);
    addData(tab.id, tab.url, tab.title);
    console.log(`Titulo: ${tab.title} e Id: ${tab.id}`);
    // getting the url in order to match the tab title
    let cleanUrl = tab.url.match(/https?:\/\/[^\/]+\/?/)[0];
    urlList.push(cleanUrl);
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    let tabTitle = tabsData[tabId];
    console.log(tabTitle);
    if (tabTitle)
        delete tabsData[tabId];
});
