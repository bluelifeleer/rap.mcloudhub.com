'use strict';
/**
 * Return a unique identifier with the given `len`.
 *
 * @param {Number} length
 * @return {String}
 * @api private
 */
module.exports = {
    UUid: function(length) {
        let uid = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+@!$&*#[]{}';
        const charsLength = chars.length;

        for (let i = 0; i < length; ++i) {
            uid += chars[this.getRandomInt(0, charsLength - 1)];
        }

        return uid;
    },
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}