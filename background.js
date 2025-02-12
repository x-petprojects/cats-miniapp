// Initialize the badge text based on the stored state
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["switchExtention"]).then((result) => {
        const switchExtention = result.switchExtention || "OFF";
        console.log(`Extension state initialized to: ${switchExtention}`);

        chrome.action.setBadgeText({
            text: switchExtention,
        });
    }).catch((error) => {
        console.error("Error accessing chrome.storage.local:", error);
    });
});

// Listen for state changes from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updateSwitchState") {
        const { state } = message;

        // Update the badge text
        chrome.action.setBadgeText({ text: state });

        // Optionally store the state in chrome.storage.local
        chrome.storage.local.set({ switchExtention: state }).then(() => {
            console.log(`Extension state updated to: ${state}`);
        });

        sendResponse({ success: true });
    }
});

// Automatically inject script on YouTube main page load/update
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const { switchExtention = "OFF" } = await chrome.storage.local.get("switchExtention");

        const scriptFunction = switchExtention === "ON" ? console.log('Switch is ON') : console.log('Switch is OFF');

        // Uncomment if you want to execute a script on the page
        // chrome.scripting.executeScript({
        //     target: { tabId },
        //     function: scriptFunction,
        // }).catch((error) => {
        //     console.error("Error executing script on tab update:", error);
        // });
    }
});