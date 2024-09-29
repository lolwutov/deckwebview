export class ColorUtils {

    /**
     * 
     * @param {string} baseColor
     * @param {string} endColor
     * @param {number} curve
     * @param {number} intensity
     * @returns {string}
     */
    static calcGradient(baseColor, endColor, curve, intensity) {
        const baseChannels = this.getRgbChannels(baseColor);
        const endChannels = this.getRgbChannels(endColor);
        const mult = Math.pow(intensity, 1 / curve);

        const mixed = baseChannels.map((base, i) => {
            const gradient = endChannels[i]
            const result = Math.floor(base * (1 - mult) + gradient * mult);
            return result.toString(16).padStart(2, 0);
        });
        return `#${mixed[0]}${mixed[1]}${mixed[2]}`
    }

    /**
     * 
     * @param {string} hexColor 
     * @returns {Array<string>}
     */
    static getRgbChannels(hexColor) {
        const r = hexColor.slice(1, 3);
        const g = hexColor.slice(3, 5);
        const b = hexColor.slice(5, 7);
        return [r, g, b].map(c => parseInt(c, 16));
    }

}