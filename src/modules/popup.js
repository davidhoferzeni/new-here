// Create a class for the element
class PopUpInfo extends HTMLElement {
  static get observedAttributes() {
    return ["data-text"];
  }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create spans
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = document.createElement("span");
    icon.setAttribute("class", "icon");

    this.#info = document.createElement("span");
    this.#info.setAttribute("class", "info");

    // Take attribute content and put it inside the info span
    const text = this.getAttribute("data-text");
    this.#info.textContent = text;

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: relative;
        display: block;
        margin: 2rem;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.3s all;
        position: absolute;
        bottom: -20px;
        left: 10px;
        z-index: 3;
      }

      .icon {
        background: blue;
        display: block;
        width: 2rem;
        height: 2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(this.#info);
  }

  /** @type {HTMLSpanElement} */
  #info;

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Custom element attribute ${name} changed.`);
    if (name === "data-text") {
      this.#info.textContent = newValue;
    }
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
