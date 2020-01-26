'use strict';
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, changedTab) {
  if (!changeInfo.url) {
    return;
  }

  chrome.storage.local.get('openingTabs', function(data) {
    if (!data.openingTabs) {
      return;
    }

    if (data.openingTabs.includes(tabId)) {
      chrome.tabs.discard(tabId);
      chrome.storage.local.set({'openingTabs': data.openingTabs.filter(tab => tab != tabId)})
    }
  })
});
