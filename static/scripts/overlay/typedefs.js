/**
 * @typedef {object} InputElementConfig 
 * @property {string} type
 * @property {string} id
 * @property {string[]} [classes=null]
 */

/**
 * @typedef {object} canvasElementConfigProps
 * @property {number} width
 * @property {number} height
 * @property {string} backgroundColor
 * @property {string} activeColor
 * @typedef {canvasElementConfigProps & InputElementConfig} CanvasElementConfig
 */

/**
 * @typedef {object} buttonInputConfigProps
 * @property {string} text
 * @typedef {buttonInputConfigProps & InputElementConfig} ButtonInputConfig
 */

/**
 * @typedef {object} ButtonData
 * @prop {boolean} pressed; 
 */

/**
 * @typedef {object} AnalogProperties
 * @property {number} max
 * @property {boolean} signed
 */

/**
 * @typedef {object} Gradient
 * @property {string} color
 * @property {number} curve
 */

/**
 * @typedef {object} linearInputConfigProps
 * @property {AnalogProperties} axis
 * @property {Gradient} [gradient=null]
 * @typedef {linearInputConfigProps & CanvasElementConfig} LinearInputConfig
 */

/**
 * @typedef {object} LinearInputData
 * @property {number} val
 */

/**
 * @typedef {object} dualStageTriggerConfigProps
 * @property {string} pressColor
 * @typedef {dualStageTriggerConfigProps & LinearInputConfig} DualStageTriggerConfig
 */

/**
 * @typedef {object} dualStageTriggerDataProps
 * @property {boolean} press
 * @typedef {dualStageTriggerDataProps & LinearInputData} DualStageTriggerData
 */

/**
 * @typedef {object} planarInputConfigProps
 * @property {AnalogProperties} xAxis
 * @property {AnalogProperties} yAxis
 * @property {number} pointRadius
 * @typedef {planarInputConfigProps & CanvasElementConfig} PlanarInputConfig
 */

/**
 * @typedef {object} PlanarInputData
 * @property {number} x
 * @property {number} y
 */


/**
 * @typedef {object} stickConfigProps
 * @prop {string} clickColor
 * @typedef {stickConfigProps & PlanarInputConfig} StickConfig
 */

/**
 * @typedef {object} stickDataProps
 * @property {boolean} click
 * @typedef {stickDataProps & PlanarInputData} StickData
 */

/**
 * @typedef {object} capStickConfigProps
 * @property {AnalogProperties} field
 * @property {string} touchColor
 * @property {number} [maxFieldSize=null]
 * @typedef {capStickConfigProps & StickConfig} CapStickConfig
 */

/**
 * @typedef {object} capStickDataProps
 * @property {number} touch
 * @property {number} field 
 * @typedef {capStickDataProps & StickData} CapStickData
 */

/**
 * @typedef {object} pressurePadConfigProps
 * @property {AnalogProperties} press
 * @property {Gradient} [pressGradient=null]
 * @property {number} [pressThreshold=0]
 * @property {number} [maxPressSize=null]
 * @typedef {pressurePadConfigProps & PlanarInputConfig} PressurePadConfig
 */

/**
 * @typedef {object} pressurePadDataProps
 * @property {number} press
 * @typedef {pressurePadDataProps & PlanarInputData} PressurePadData
 */

