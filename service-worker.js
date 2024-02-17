const welcomePage = 'sidepanels/welcome-sp.html';
const mainPage = 'sidepanels/calendar.html';
// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open side panel',
    contexts: ['all']
  });
});
notification();
function notification(){
  chrome.notifications.create(' ',
    {
      title: 'ProdPal',
      message: 'Drink Water dummas!',
      iconUrl: 'images/icon-16.png',
      type: 'basic'
    }
  );

}
/*chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel') {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId });
  }
});

/*chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setOptions({ path: welcomePage });
  });
  
  chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    const { path } = await chrome.sidePanel.getOptions({ tabId });
    if (path === welcomePage) {
      chrome.sidePanel.setOptions({ path: mainPage });
    }
  });*/