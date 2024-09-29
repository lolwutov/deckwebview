export class AxisUtils {

    /**
     * 
     * @param {number} maxViewVal 
     * @param {number} maxAxisVal 
     * @param {boolean} signed 
     * @returns 
     */
    static calcAxisRatio(maxViewVal, maxAxisVal, signed) {
        maxAxisVal = signed ?  this.normalizeSignedVal(maxAxisVal, maxAxisVal) : maxAxisVal;
        return maxViewVal / maxAxisVal;
    }

    /**
     * 
     * @param {number} inputValue 
     * @param {number} maxValue 
     * @returns 
     */
    static normalizeSignedVal(inputValue, maxValue) {
        return inputValue + maxValue + 1;
    }

    /**
     * 
     * @param {number} inputValue 
     * @param {number} maxValue 
     * @returns 
     */
    static normalizeAndInvert(inputValue, maxValue) {
        const normalizedInput = this.normalizeSignedVal(inputValue, maxValue);
        const normalizedMax = this.normalizeSignedVal(maxValue, maxValue);
        return this.invertAxis(normalizedInput, normalizedMax);
    }

    /**
     * 
     * @param {number} val 
     * @param {number} maxVal 
     * @returns 
     */
    static invertAxis(val, maxVal) {
        return maxVal - val;
    }
}