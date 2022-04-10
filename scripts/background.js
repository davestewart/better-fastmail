chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === 'exec') {
    const target = { tabId: sender.tab.id }

    // styles
    chrome.scripting.insertCSS({
      target,
      files: ['scripts/styles.css'],
    })

    // script
    chrome.scripting.executeScript({
      target,
      files: ['scripts/main.js'],
      world: 'MAIN',
    })
  }
})
