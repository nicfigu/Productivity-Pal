/// background.js

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "WATER") {
    chrome.notifications.create('WATER', {
      type: 'basic',
      iconUrl: 'images/icon-16.png',
      title: 'ProdPal',
      message: 'It is time to drink water.',
      priority: 1
    });}
    else if (alarm.name === "15"){
      chrome.notifications.create('15', {
        type: 'basic',
        iconUrl: 'images/icon-16.png',
        title: 'ProdPal',
        message: 'There is a task due in 15 minutes!',
        priority: 1
      });}
    else if (alarm.name === "60"){
        chrome.notifications.create('HOUR', {
        type: 'basic',
        iconUrl: 'images/icon-16.png',
        title: 'ProdPal',
        message: 'There is a task due in 60 minutes!',
        priority: 1
      });}
});

chrome.alarms.create('WATER', {
  when: Date.now(),
  periodInMinutes: 20
});

/*chrome.alarms.create('BREAK', {
  when: Date.getTime(),
  periodInMinutes: 200
});
*/
/*// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Set the browsing start time when the extension is installed or updated
  const browsingStartTime = new Date().getTime();
  chrome.storage.local.set({ browsingStartTime });
});
*/
// Listen for when Chrome is launched
/*chrome.runtime.onStartup.addListener(() => {
  // Set the browsing start time when Chrome is launched
  const browsingStartTime = new Date().getTime();
  chrome.storage.local.set({ browsingStartTime });
});

// Set up a listener for tab changes
chrome.tabs.onActivated.addListener(checkTimeElapsed);

// Listen for tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // Set the browsing start time when a tab URL changes
    const browsingStartTime = new Date().getTime();
    chrome.storage.local.set({ browsingStartTime });
  }
});
// Check if 3 hours have elapsed since the user started browsing
function checkTimeElapsed() {
  // Get the current time
  const currentTime = new Date().getTime();

  // Retrieve the browsing start time from storage
  chrome.storage.local.get(['browsingStartTime'], (result) => {
    const browsingStartTime = result.browsingStartTime || currentTime;

    // Calculate the elapsed time in milliseconds
    const elapsedTime = currentTime - browsingStartTime;

    // Check if 3 hours have elapsed
    if (elapsedTime >= 3 * 60 * 60 * 1000) {
      // Send a notification
      chrome.notifications.create('reminderNotification', {
        type: 'basic',
        iconUrl: 'images/icon-16.png',
        title: 'Time to take a break!',
        message: 'You have been browsing for 3 hours. Take a break!',
      });
    }
  });
}*/