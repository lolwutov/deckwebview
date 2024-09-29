import { ControllerFrame } from "./scripts/overlay/frame.js";
import { activeController, activeStyleSheet, configs } from "./config/controller.js";

window.onload = () => main();


function addStyleSheet(styleName) {
    let styleLink = document.createElement("link");
    const path = `./config/styles/${styleName}`
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("type", "text/css");
    styleLink.setAttribute("href", path);
    document.getElementsByTagName("head").item(0).appendChild(styleLink);
}

function main() {   
    addStyleSheet(activeStyleSheet);

    const overlay = new ControllerFrame(configs[activeController], document.body);
    const socket = new WebSocket(`ws://${location.host}/ws`)

    socket.onopen = function(e) {
        console.log(`[ws]: connected to ${location.host}`);
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data)
        overlay.updateInputs(data);
      };

}