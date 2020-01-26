'use strict';

function stash(event) {
  chrome.tabs.query({ currentWindow: true, pinned: false}, tabs => {
    let pages = tabs.reduce((acc, tab) => {
      acc['ids'].push(tab.id)
      acc['urls'].push(tab.url)
      return acc
    }, {'ids': [], urls: [] });

    chrome.tabs.remove(pages['ids']);
    chrome.storage.local.set({'urls': pages['urls']}, () => {
      window.close();
    });
  });
}

function apply() {
  chrome.storage.local.get('urls', data => {
    if (!data.urls) {
      window.close();
    }

    chrome.tabs.query({ currentWindow: true, pinned: false}, tabs => {
      let urls = data.urls.filter(url => !tabs.some(tab => tab.url === url));
      if (urls.length === 0) {
        window.close();
      }

      let tabsCreated = [];
      urls.forEach(url => {
        chrome.tabs.create({ url: url, active: false}, tab => {
          tabsCreated.push(tab.id);
          if (tabsCreated.length === urls.length) {
            chrome.storage.local.set({ 'openingTabs': tabsCreated });
            window.close();
          }
        });
      });
    });
  });
}

document.getElementById('stash').addEventListener('click', stash);
document.getElementById('apply').addEventListener('click', apply);
