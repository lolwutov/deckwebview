import { ButtonInput, CapacitorStick, DualStageTrigger, InputElement, LinearInput, PlanarInput, PressurePad, Stick } from "./inputs.js";

export class ControllerFrame {

    /**
     * 
     * @param {InputElementConfig[]} configs
     * @param {HTMLDivElement} parent 
     */
    constructor(config, parent) {
        /**
         * @type {InputElement[]}
         */
        this.inputs = {};
        this.wrapper = this.makeFrame(config);
        parent.appendChild(this.wrapper);
    }

    /**
     * @param {InputElementConfig[]} configs 
     * @returns 
     */
    makeFrame(config) {
        const frame = document.createElement('div');
        frame.id = 'controller-frame';
        config.forEach(inputConfig => {
            let input;
            switch (inputConfig.type) {
                case ('button'):
                    input = new ButtonInput(inputConfig);
                    break;
                case ('linear'):
                    input = new LinearInput(inputConfig);
                    break;
                case ('pressurePad'):
                    input = new PressurePad(inputConfig);
                    break;
                case ('planar'):
                    input = new PlanarInput(inputConfig);
                    break;
                case ('dstrigger'):
                    input = new DualStageTrigger(inputConfig);
                    break;
                case ('stick'):
                    input = new Stick(inputConfig);
                    break;
                case ('capStick'):
                    input = new CapacitorStick(inputConfig);
                    break;
                default:
                    break;
            }
            if (!!input) {
                this.inputs[input.id] = input;
                frame.appendChild(input.getElement());
            }
        });
        return frame;
    }

    updateInputs(inputData) {
        inputData.forEach(d => {
            const input = this.inputs[d.id];
            if (!!input) {
                input.updateInput(d);
            }
        })
    }
}