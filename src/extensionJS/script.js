document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({}, function (tabs) {
    let titlesList = document.getElementById("titlesList");

    tabs.forEach((tab) => {
      let listItem = document.createElement("li");
      listItem.textContent = tab.title;
      titlesList.appendChild(listItem);
    });
  });
});
