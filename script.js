import { BASE_URL, IMAGE_STYLES, TEXT_STYLES } from "./config.js";
import { createOrUpdateElement } from "./domUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("toggle-switch");
    const customValueInput = document.getElementById("custom-value");
    const saveValueButton = document.getElementById("save-value");

    // Load the initial state from localStorage (or default to OFF)
    const isFeatureEnabled = JSON.parse(localStorage.getItem("featureEnabled")) || false;
    toggleSwitch.checked = isFeatureEnabled;

    // Load the saved custom value from localStorage
    const savedCustomValue = localStorage.getItem("customValue") || "";
    customValueInput.value = savedCustomValue;

    // Add event listener to handle toggle switch changes
    toggleSwitch.addEventListener("change", (event) => {
        const isEnabled = event.target.checked;
        const state = isEnabled ? "ON" : "OFF";

        // Save the state to localStorage
        localStorage.setItem("featureEnabled", JSON.stringify(isEnabled));

        // Notify the background script about the state change
        chrome.runtime.sendMessage({ type: "updateSwitchState", state }, (response) => {
            if (response && response.success) {
                console.log(`Background script updated with state: ${state}`);
            }
        });

        // Enable or disable the feature
        if (isEnabled) {
            fetchData();
        } else {
            clearFeature();
        }
    });

    // Save the custom value when the button is clicked
    saveValueButton.addEventListener("click", () => {
        const customValue = customValueInput.value;

        // Save the value to localStorage
        localStorage.setItem("customValue", customValue);

        // Notify the background script about the updated value
        chrome.runtime.sendMessage({ type: "updateCustomValue", customValue }, (response) => {
            if (response && response.success) {
                console.log(`Background script updated with custom value: ${customValue}`);
            }
        });
    });

    // Optionally initialize the feature if it was enabled
    if (isFeatureEnabled) {
        fetchData();
    }
});



async function fetchData() {
    const randomNumber = getRandomInt(100, 103);
    const url = `${BASE_URL}${randomNumber}`;

    // Create or update the image element
    const imageElement = createOrUpdateElement("cat-image", "img", ".container", IMAGE_STYLES);
    imageElement.src = url;
    imageElement.alt = "Random Cat Image";

    // Add hover effect
    imageElement.addEventListener("mouseover", () => {
        imageElement.style.transform = "scale(1.05)";
    });
    imageElement.addEventListener("mouseout", () => {
        imageElement.style.transform = "scale(1)";
    });

    // Create or update the text element
    createOrUpdateElement("some-text", "p", ".container", TEXT_STYLES, `Random number is ${randomNumber}`);
}

function getRandomInt(min, max) {
    const min1 = Math.ceil(min);
    const max1 = Math.floor(max);
    return Math.floor(Math.random() * (max1 - min1 + 1) + min1);
}

function clearFeature() {
    // Example: Clear the image and text
    const imageElement = document.getElementById("cat-image");
    const textElement = document.getElementById("some-text");
    if (imageElement) imageElement.remove();
    if (textElement) textElement.remove();
}