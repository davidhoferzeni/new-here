import htmlTemplate from "./popup.html?raw";
import cssTemplate from "./popup.css?raw";
import { html, render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

class PopUpInfo extends HTMLElement {
  static get observedAttributes() {
    return ["data-text"];
  }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    const sayHi = html`${unsafeHTML(htmlTemplate)}`;
    render(sayHi, shadow);
    const style = document.createElement("style");
    style.textContent = cssTemplate;
    shadow.appendChild(style);
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Custom element attribute ${name} changed.`);
  }
}

// Define the new element
customElements.define("popup-info", PopUpInfo);

/**
 * @param {HTMLElement} parentElement
 * @param {string} text
 */
export default function createPopup(parentElement, text) {
  const popupInfo = document.createElement("popup-info");
  popupInfo.setAttribute("data-text", text);
  parentElement.appendChild(popupInfo);
}
