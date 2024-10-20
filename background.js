chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "extractUrl" }, (response) => {
        if (response) {
            if (response.success) {
                showSuccessIcon();
                alert(response.message);
            } else {
                alert(response.message);
            }
        } else {
            console.error('No response from content script.');
        }
    });
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

function showSuccessIcon() {
    chrome.action.setIcon({
        path: {
            "16": "icon16_success.png",
            "48": "icon48_success.png",
            "128": "icon128_success.png"
        }
    });
    setTimeout(() => {
        chrome.action.setIcon({
            path: {
                "16": "icon16.png",
                "48": "icon48.png",
                "128": "icon128.png"
            }
        });
    }, 2000); // Revert back after 2 seconds
}
