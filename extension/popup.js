'use strict';

document.getElementById('stash').addEventListener('click', () => {
  chrome.runtime.sendMessage({'command': "stash"});
  window.close();
});

document.getElementById('apply').addEventListener('click', () => {
  chrome.runtime.sendMessage({'command': "apply_stash"});
  window.close();
});
