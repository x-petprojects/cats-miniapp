import { BASE_URL, IMAGE_STYLES, TEXT_STYLES } from "./config.js";
import { createOrUpdateElement } from "./domUtils.js";

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

fetchData();