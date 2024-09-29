import { AxisUtils } from "./axis-utils.js";
import { ColorUtils } from "./color-utils.js";

/**
 * @template T
 */
export class InputElement {

    /**
     * 
     * @param {InputElementConfig} config 
     */
    constructor(config) {
        this.id = config.id;
        this.classes = config.classes ? config.classes : [];
        this.element = null;
    }

    /**
     * @param {string} type 
     * @returns {T} 
     */
    createElement(type) {
        const element = document.createElement(type);
        element.id = this.id;
        element.classList.add('input');
        if (!!this.classes) {
            this.classes.forEach(cl => {
                element.classList.add(cl);
            });
        }
        return element;
    }

    /**
     * 
     * @returns {T}
     */
    getElement() {
        return this.element;
    }

    updateInput(data) {}
}

/**
 * @extends InputElement<HTMLDivElement>
 */
export class ButtonInput extends InputElement {

    /**
     * 
     * @param {ButtonInputConfig} config 
     */
    constructor(config) {
        super(config);
        this.text = config.text

        this.element = this.createElement('div');
        this.element.classList.add('button');
        this.element.innerText = this.text;
    }


    /**
     * 
     * @param {ButtonData} data 
     */
    updateInput(data) {
        data.pressed ? this.element.classList.add('pressed') : this.element.classList.remove('pressed');
    }
}


/**
 * @extends {InputElement<HTMLCanvasElement>}
 */
export class CanvasElement extends InputElement {

    /**
     * 
     * @param {CanvasElementConfig} config 
     */
    constructor(config) {
        super(config);
        this.width = config.width;
        this.height = config.height;
        this.backgroundColor = config.backgroundColor;
        this.activeColor = config.activeColor;

        this.element = this.createElement('canvas');
        this.element.width = this.width;
        this.element.height = this.height;
    }

    /**
     * 
     * @param {{stroke:string, fill:string, lineWidth:string}} style 
     * @param {Function} f 
     */
    drawWithinContext(f, color) {
        const context = this.element.getContext('2d', { alpha: false });
        //context.strokeStyle = !!style.stroke ? style.stroke : this.activeColor;
        //context.fillStyle = !!style.fill ? style.fill : this.backgroundColor;
        //context.lineWidth = !!style.lineWidth ? style.lineWidth : 1;
        context.fillStyle = !!color ? color : this.activeColor;
        context.beginPath();
        f.apply(this, [context]);
    }

    clear() {
        this.drawWithinContext((
            /**
             * @type {CanvasRenderingContext2D}
             */
            context
        ) => {
            context.fillRect(0, 0, this.width, this.height);
        }, this.getBackgroundColor(null));
    }

    getBackgroundColor(data) {
        return this.backgroundColor;
    }

    getActiveColor(data) {
        return this.activeColor;
    }
}


/**
 * @extends {CanvasElement}
 */
export class LinearInput extends CanvasElement {

    /**
     * 
     * @param {LinearInputConfig} config 
     */
    constructor(config) {
        super(config);
        this.axis = config.axis;
        this.gradient = config.gradient;
        this.ratio = AxisUtils.calcAxisRatio(this.width, this.axis.max, this.axis.signed);
        this.element.classList.add('linear');
        this.clear();
    }

    /**
     * 
     * @param {LinearInputData} data 
     */
    updateInput(data) {
        this.clear();
        const fillWidth = data.val * this.ratio;
        const start = this.axis.signed ? this.width / 2 - fillWidth : 0;

        this.drawWithinContext((/** @type {CanvasRenderingContext2D} */  ctx) => {
            ctx.fillRect(start, 0, fillWidth, this.height);
        }, this.getActiveColor(data));
    }
    

    /**
     * 
     * @param {LinearInputData} data 
     * @returns 
     */
    getActiveColor(data) {
        return this.getGradientColor(data);
    }

    /**
     * 
     * @param {LinearInputData} data 
     * @returns 
     */
    getGradientColor(data) {
        if (!this.gradient) {
            return this.activeColor;
        }
        const intensity = Math.abs(data.val / this.axis.max); 
        return ColorUtils.calcGradient(this.activeColor, this.gradient.color, this.gradient.curve, intensity);
    }
}

/**
 * @extends LinearInput
 */
export class DualStageTrigger extends LinearInput {
    /**
     * 
     * @param {DualStageTriggerConfig} config 
     */
    constructor(config) {
        super(config);
        this.pressColor = config.pressColor;
        this.element.classList.add('dst');
    }

    /**
     * 
     * @param {DualStageTriggerData} data 
     * @returns 
     */
    getActiveColor(data) {
        return data.press ? this.pressColor : this.getGradientColor(data);
    }
}

/**
 * @extends CanvasElement
 */
export class PlanarInput extends CanvasElement {

    /**
     * 
     * @param {PlanarInputConfig} config 
     */
    constructor(config) {
        super(config);
        this.xAxis = config.xAxis
        this.yAxis = config.xAxis;
        this.pointRadius = config.pointRadius;

        this.element.classList.add('planar');
        this.xRatio = AxisUtils.calcAxisRatio(this.width, this.xAxis.max, this.xAxis.signed);
        this.yRatio = AxisUtils.calcAxisRatio(this.height, this.yAxis.max, this.yAxis.signed);
        this.clear();
    }

    /**
     * 
     * @param {PlanarInputData} data 
     * @returns 
     */
    updateInput(data) {
        this.clear();
        if (!data.x && !data.y) {
            return;
        }

        const x = this.xAxis.signed ? AxisUtils.normalizeSignedVal(data.x, this.xAxis.max) * this.xRatio : data.x * this.xRatio;
        const y = this.yAxis.signed ? AxisUtils.normalizeAndInvert(data.y, this.yAxis.max) * this.yRatio : data.y * this.yRatio;
        this.drawWithinContext((context) => {
            context.arc(x, y, this.getPointRadius(data), 0, 2 * Math.PI);
            context.fill();
        }, this.getActiveColor(data));

    }

    /**
     * 
     * @param {PlanarInputData} data 
     * @returns 
     */
    getPointRadius(data) {
        return this.pointRadius;
    }
}


/**
 * @extends {PlanarInput}
 */
export class Stick extends PlanarInput {

    /**
     * 
     * @param {StickConfig} config 
     */
    constructor(config) {
        super(config);
        this.clickColor = config.clickColor;
        this.element.classList.add('stick');
    }

    /**
     * 
     * @param {StickData} data 
     */
    getActiveColor(data) {
        data.click > 0 ? this.getClickColor(data) : this.activeColor; 
    }

    /**
     * 
     * @param {StickData} data 
     */
    getClickColor(data) {
        return this.clickColor
    }
}

/**
 * @extends {Stick}
 */
export class CapacitorStick extends Stick {

    /**
     * 
     * @param {CapStickConfig} config 
     */
    constructor(config) {
        super(config);
        this.field = config.field;
        this.touchColor = config.touchColor;
        this.maxFieldSize = config.maxFieldSize;
        this.fieldSizeRatio = 0;
        if (!!this.maxFieldSize) {
            const norm = this.field.signed ? AxisUtils.normalizeSignedVal(this.field.max, this.field.max) : this.field.max;
            this.fieldSizeRatio = norm / (this.maxFieldSize - this.pointRadius);
        }
        this.element.classList.add('cap');
    }

    /**
     * 
     * @param {CapStickData} data 
     * @returns {string}
     */
    getActiveColor(data) {
        if (data.click > 0) {
            return this.clickColor;
        }
        return data.touch > 0 ? this.touchColor : this.activeColor;
    }

    /**
     * 
     * @param {CapStickData} data 
     * @returns {number}
     */
    getPointRadius(data) {
        if (!this.maxFieldSize) {
            return this.pointRadius;
        }

        const val = this.field.signed ? AxisUtils.normalizeSignedVal(data.field, this.field.max) : data.field;
        // TODO:
        // deck's touch value should be unsigned, but it goes down to -20 sometimes for some reason
        // and it's upper bound is unclear. Need to find correct data
        return Math.max(val / this.fieldSizeRatio) + this.pointRadius;
    }
}

/**
 * @extends {PlanarInput}
 */
export class PressurePad extends PlanarInput {

    /**
     * 
     * @param {PressurePadConfig} config 
     */
    constructor(config) {
        super(config)
        this.press = config.press;
        this.pressGradient = config.pressGradient;
        this.pressThreshold = !!config.pressThreshold ? config.pressThreshold : 0;
        this.maxPressSize = config.maxPressSize;
        this.pressSizeRatio = 0;
        if (!!this.maxPressSize) {
            const norm = this.press.signed ? AxisUtils.normalizeSignedVal(this.press.max, this.press.max) : this.press.max;
            this.pressSizeRatio = norm / (this.maxPressSize - this.pointRadius);
        }
        this.element.classList.add('pressure');
    }

    /**
     * 
     * @param {PressurePadData} data 
     */
    getActiveColor(data) {
        if (!this.pressGradient) {
            return this.activeColor;
        }

        const val = this.press.signed ? AxisUtils.normalizeSignedVal(data.press, this.press.max) : data.press;
        if (!!this.pressGradient) {
            if (this.pressThreshold > 0) {
                return val > this.pressThreshold ? this.pressGradient.color : this.activeColor;
            }
            const intensity = this.press.signed ? val / AxisUtils.normalizeSignedVal(this.press.max, this.press.max) : val / this.press.max;
            return ColorUtils.calcGradient(this.activeColor, this.pressGradient.color, this.pressGradient.curve, intensity);
        }
    }

    /**
     * 
     * @param {PressurePadData} data 
     * @returns {number}
     */
    getPointRadius(data) {
        if (!this.maxPressSize) {
            return this.pointRadius;
        }
        const val = this.press.signed ? AxisUtils.normalizeSignedVal(data.press, this.press.max) : data.press;
        return val / this.pressSizeRatio + this.pointRadius;
    }
}