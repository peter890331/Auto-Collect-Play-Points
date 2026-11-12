// https://github.com/peter890331/Auto-Collect-Play-Points

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ claimCount: 0, nextClaimDate: 0 });
  }
  chrome.alarms.create('checkIdleAlarm', { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('checkIdleAlarm', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkIdleAlarm') {
    chrome.idle.queryState(600, (state) => {
      if (state === 'idle' || state === 'locked') {
        chrome.storage.local.get(['nextClaimDate', 'autoRunFlag'], (result) => {
          const now = Date.now();
          
          if (result.autoRunFlag && (now - result.autoRunFlag < 300000)) {
            return; 
          }

          const nextDate = result.nextClaimDate || 0;
          
          if (now >= nextDate) {
            chrome.storage.local.set({ autoRunFlag: now }, () => {
              chrome.tabs.create({ url: "https://play.google.com/store/points/perks", active: true });
            });
          }
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'closeTab' && sender.tab) {
    chrome.tabs.remove(sender.tab.id);
  }
});