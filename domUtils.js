export function createOrUpdateElement(id, tagName, parentSelector, styles = {}, content = "") {
    let element = document.getElementById(id);
    if (!element) {
        const parent = document.querySelector(parentSelector);
        element = document.createElement(tagName);
        element.id = id;
        parent.appendChild(element);
    }
    Object.assign(element.style, styles);
    if (content) element.textContent = content;
    return element;
}