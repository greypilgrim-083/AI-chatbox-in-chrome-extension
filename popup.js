

// popup.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const result = await chrome.storage.local.get(['gemini_api_key']);
        console.log('Loading API key:', result.gemini_api_key ? 'exists' : 'not found');
        if (result.gemini_api_key) {
            document.getElementById('api-key').value = result.gemini_api_key;
            document.getElementById('response').textContent = 'API key loaded!';
        } else {
            document.getElementById('response').textContent = 'No API key found. Please enter your key.';
        }
    } catch (error) {
        console.error('Error loading API key:', error);
        document.getElementById('response').textContent = `Error loading API key: ${error.message}`;
    }
});

document.getElementById('save-key').addEventListener('click', async () => {
    const apiKey = document.getElementById('api-key').value.trim();
    if (!apiKey) {
        document.getElementById('response').textContent = 'Please enter an API key';
        return;
    }
    
    try {
        await chrome.storage.local.set({ 'gemini_api_key': apiKey });
        const saved = await chrome.storage.local.get(['gemini_api_key']);
        console.log('Saved API key:', saved.gemini_api_key ? 'exists' : 'not found');
        document.getElementById('response').textContent = 'API key saved successfully!';
    } catch (error) {
        console.error('Error saving API key:', error);
        document.getElementById('response').textContent = `Error saving API key: ${error.message}`;
    }
});

// background.js
async function getAPIKey() {
    const result = await chrome.storage.local.get(['gemini_api_key']);
    console.log('Retrieved API key:', result.gemini_api_key ? 'exists' : 'not found');
    if (!result.gemini_api_key) {
        throw new Error("Please set your Gemini API key in the extension popup");
    }
    return result.gemini_api_key;
}

async function handleAIRequest(userInput) {
    try {
        const apiKey = await getAPIKey();
        const geminiApiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const response = await fetch(geminiApiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userInput
                    }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API Error:", error);
        throw new Error(`AI processing failed: ${error.message}`);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'userInput') {
        handleAIRequest(message.data)
            .then(response => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: 'aiResponse',
                    data: response
                });
            })
            .catch(error => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: 'aiResponse',
                    data: `Error: ${error.message}`
                });
            });
    }
    return true;
});
