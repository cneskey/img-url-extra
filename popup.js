document.getElementById('extractButton').addEventListener('click', function() {
    navigator.clipboard.read().then(clipboardItems => {
        for (let clipboardItem of clipboardItems) {
            if (clipboardItem.types.includes('text/html')) {
                clipboardItem.getType('text/html').then(blob => {
                    blob.text().then(html => {
                        const url = extractFirstUrl(html);
                        if (url) {
                            copyToClipboard(url);
                            alert('URL copied to clipboard!');
                        } else {
                            alert('No URL found in clipboard data.');
                        }
                    });
                });
            } else if (clipboardItem.types.includes('text/plain')) {
                clipboardItem.getType('text/plain').then(blob => {
                    blob.text().then(text => {
                        const url = extractFirstUrl(text);
                        if (url) {
                            copyToClipboard(url);
                            alert('URL copied to clipboard!');
                        } else {
                            alert('No URL found in clipboard data.');
                        }
                    });
                });
            } else {
                alert('No supported clipboard type found.');
            }
        }
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
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
    navigator.clipboard.writeText(tempInput.value)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
    document.body.removeChild(tempInput);
}
