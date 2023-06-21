import createPopup from "./modules/popup";

const testElement = document.getElementById("test");
if (testElement) {
  createPopup(testElement, "This is a test popover");
}
