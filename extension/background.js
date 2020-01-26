'use strict';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, changedTab) {
  if (!changeInfo.url) {
    return;
  }

  chrome.storage.local.get('tabs', function(data) {
    if (!data.tabs) {
      return;
    }

    if (data.tabs.includes(tabId)) {
      chrome.tabs.discard(tabId);
      chrome.storage.local.set({'tabs': data.tabs.filter(tab => tab != tabId)})
    }
  })
});

chrome.commands.onCommand.addListener(executeCommand);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  executeCommand(request.command)
});

function executeCommand(command) {
  if (command === 'apply_stash') {
    applyStash();
  } else if (command === 'stash') {
    stash();
  }
}

function applyStash() {
  chrome.storage.local.get('urls', data => {
    if (!data.urls) {
      return;
    }

    chrome.tabs.query({ currentWindow: true, pinned: false}, tabs => {
      let urls = data.urls.filter(url => !tabs.some(tab => tab.url === url));
      if (urls.length === 0) {
        return;
      }

      let tabsCreated = [];
      urls.forEach(url => {
        chrome.tabs.create({ url: url, active: false}, tab => {
          tabsCreated.push(tab.id);
          chrome.storage.local.set({ 'tabs': tabsCreated });
        });
      });
    });
  });
}

function stash() {
  chrome.tabs.query({ currentWindow: true, pinned: false}, tabs => {
    if (tabs.length === 0) {
      return;
    }

    chrome.tabs.remove(tabs.map(tab => tab.id));
    chrome.storage.local.set({'urls': tabs.map(tab => tab.url)});
  });
}
