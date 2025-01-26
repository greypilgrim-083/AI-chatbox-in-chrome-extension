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
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
        
        const response = await fetch(geminiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: userInput
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Raw error response:", errorData);
            throw new Error(errorData || 'API request failed');
        }

        const data = await response.json();
        console.log("API Response:", data);
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

async function handleAIRequestWithContext(userInput, context = null) {
    try {
        const apiKey = await getAPIKey();
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
        
        // Prepare the prompt with optional context
        const fullPrompt = context 
            ? `Context:\n${context}\n\nUser Query:\n${userInput}` 
            : userInput;
        
        const response = await fetch(geminiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: fullPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Raw error response:", errorData);
            throw new Error(errorData || 'API request failed');
        }

        const data = await response.json();
        console.log("API Response:", data);
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

async function analyzeContent(content) {
    try {
        let prompt = '';
        
        switch(content.type) {
            case 'leetcode':
                prompt = `
                Analyzing LeetCode Problem:
                Title: ${content.title}
                Difficulty: ${content.difficulty}
                
                Problem Description:
                ${content.description}
                
                Please provide:
                1. Problem explanation
                2. Key concepts needed
                3. Suggested approach with pseudocode
                4. Time and space complexity analysis
                5. Common pitfalls to avoid
                `;
                break;
                
            case 'codeforces':
                prompt = `
                Analyzing CodeForces Problem:
                Title: ${content.title}
                Time Limit: ${content.timeLimit}
                Memory Limit: ${content.memoryLimit}
                
                Problem Description:
                ${content.description}
                
                Input Specification:
                ${content.inputSpec}
                
                Output Specification:
                ${content.outputSpec}
                
                Sample Tests:
                ${JSON.stringify(content.sampleTests, null, 2)}
                
                Please provide:
                1. Problem explanation
                2. Key concepts needed
                3. Solution approach with complexity analysis
                4. How to handle edge cases
                5. Tips for passing time and memory limits
                `;
                break;
                
            case 'jupyter':
            case 'colab':
                // Extract code blocks from the content
                const codeBlocks = content.cells
                    .filter(cell => cell.type === 'code')
                    .map(cell => cell.content)
                    .join('\n\n');
                    
                prompt = `
                Analyzing Notebook Code:
                
                Code Content:
                ${codeBlocks}
                
                Please provide:
                1. Code explanation
                2. Potential improvements or optimizations
                3. Any bugs or issues to watch out for
                4. Suggestions for better practices
                5. Performance considerations
                `;
                break;
                
            default:
                throw new Error(`Unsupported content type: ${content.type}`);
        }
        
        // Send the prompt to the AI and return the response
        return await handleAIRequest(prompt);
    } catch (error) {
        console.error('Error analyzing content:', error);
        throw error;
    }
}

// Update the message listener in background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'userInput') {
        // Check if context is provided
        const requestHandler = message.context 
            ? handleAIRequestWithContext 
            : handleAIRequest;

        requestHandler(message.data, message.context)
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
    } else if (message.action === 'analyzeContent') {
        analyzeContent(message.data)
            .then(analysis => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: 'aiResponse',
                    data: analysis
                });
                sendResponse({ success: true });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
        return true;
    }
    return true;
});