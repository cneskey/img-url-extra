chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractUrl") {
    navigator.clipboard.read().then(clipboardItems => {
      for (let clipboardItem of clipboardItems) {
        if (clipboardItem.types.includes('text/html')) {
          clipboardItem.getType('text/html').then(blob => {
            blob.text().then(html => {
              const url = extractFirstUrl(html);
              if (url) {
                copyToClipboard(url);
                sendResponse({ success: true, message: 'URL copied to clipboard!' });
              } else {
                sendResponse({ success: false, message: 'No URL found in clipboard data.' });
              }
            });
          });
        } else if (clipboardItem.types.includes('text/plain')) {
          clipboardItem.getType('text/plain').then(blob => {
            blob.text().then(text => {
              const url = extractFirstUrl(text);
              if (url) {
                copyToClipboard(url);
                sendResponse({ success: true, message: 'URL copied to clipboard!' });
              } else {
                sendResponse({ success: false, message: 'No URL found in clipboard data.' });
              }
            });
          });
        } else {
          sendResponse({ success: false, message: 'No supported clipboard type found.' });
        }
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
      sendResponse({ success: false, message: 'Failed to read clipboard contents.' });
    });
    return true; // Keep the message channel open for async response
  }
});

function extractFirstUrl(content) {
  const urlMatch = content.match(/https?:\/\/[^\s"]+/);
  return urlMatch ? urlMatch[0] : null;
}

function copyToClipboard(text) {
  const tempInput = document.createElement('input');
  document.body.appendChild(tempInput);
  tempInput.value = text;
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}
