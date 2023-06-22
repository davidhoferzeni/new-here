import htmlTemplate from "./popup.html?raw";
import cssTemplate from "./popup.css?raw";
import { html, render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

class PopUpInfo extends HTMLElement {
  static get observedAttributes() {
    return ["data-text", "pos-x", "pos-y", "width", "height", "target-id"];
  }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    const renderedTemplate = html`${unsafeHTML(htmlTemplate)}`;
    render(renderedTemplate, shadow);
    const style = document.createElement("style");
    style.textContent = cssTemplate;
    shadow.appendChild(style);

    const nextButton = shadow.querySelector(".next-btn");
    if (nextButton) {
      /** @type {HTMLButtonElement} */
      (/** @type {unknown} */ (nextButton)).onclick = () => {
        this.setNextElement();
      };
    }

    const popover = shadow.getElementById("my-popover");
    if (popover) {
      popover.addEventListener("beforetoggle", () => {
        this.#resetElements();
      });
    }
    //this.#updateElement();
  }

  /** @type {string[]} */
  #elementIds = [];
  #currentElement = 0;

  #updateElement = () => {
    const styleElement = this.shadowRoot?.getElementById("my-popover");
    if (!styleElement) {
      return;
    }
    const targetId = this.getAttribute("target-id");
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        const newPosition = calculateTarget(target);
        styleElement.style.setProperty("--xPos", newPosition.x + "px");
        styleElement.style.setProperty("--yPos", newPosition.y + "px");
        styleElement.style.setProperty("--w", newPosition.w + "px");
        styleElement.style.setProperty("--h", newPosition.h + "px");
        return;
      }
    }
    const posXAttribute = this.getAttribute("pos-x");
    if (posXAttribute) {
      styleElement.style.setProperty("--xPos", posXAttribute + "px");
    }
    const posYAttribute = this.getAttribute("pos-x");
    if (posYAttribute) {
      styleElement.style.setProperty("--yPos", posYAttribute + "px");
    }
    const widthAttribute = this.getAttribute("width");
    if (widthAttribute) {
      styleElement.style.setProperty("--w", widthAttribute + "px");
    }
    const heightAttribute = this.getAttribute("height");
    if (heightAttribute) {
      styleElement.style.setProperty("--h", heightAttribute + "px");
    }
  };

  setElementIds = (/** @type {string[]} */ elementIds) => {
    this.#elementIds = elementIds;
    this.#resetElements();
  };

  #resetElements = () => {
    this.#currentElement = 0;
    this.setNextElement();
  };

  setNextElement = () => {
    if (this.#elementIds && this.#currentElement >= this.#elementIds.length) {
      const popoverElement = this.shadowRoot?.getElementById("my-popover");
      if (popoverElement) {
        // @ts-ignore
        popoverElement.hidePopover();
      }
      return;
    }
    this.setAttribute("target-id", this.#elementIds[this.#currentElement]);
    this.#currentElement++;
  };

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this.#updateElement();
  }
}

// Define the new element
customElements.define("popup-info", PopUpInfo);

/**
 * @param {HTMLElement} target
 * @returns
 */
function calculateTarget(target) {
  return {
    x: target.offsetLeft,
    y: target.offsetTop,
    w: target.offsetWidth,
    h: target.offsetHeight,
  };
}

/**
 * @param {string} text
 * @param {HTMLElement} targetElement
 * @param {HTMLElement} [parentElement]
 */
export function createPopup(text, targetElement, parentElement) {
  const popupInfo = document.createElement("popup-info");
  popupInfo.setAttribute("data-text", text);
  const targetPos = calculateTarget(targetElement);
  popupInfo.setAttribute("pos-x", targetPos.x.toString());
  popupInfo.setAttribute("pos-y", targetPos.y.toString());
  popupInfo.setAttribute("width", targetPos.w.toString());
  popupInfo.setAttribute("height", targetPos.h.toString());
  if (!parentElement) {
    document.body.appendChild(popupInfo);
    return;
  }
  parentElement.appendChild(popupInfo);
}

/**
 * @param {string[]} elementIds
 */
export function createPopups(...elementIds) {
  const popupInfo = document.createElement("popup-info");
  /** @type {PopUpInfo} */
  (/** @type {unknown} */ (popupInfo)).setElementIds(elementIds);
  document.body.appendChild(popupInfo);
}
