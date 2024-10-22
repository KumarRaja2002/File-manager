"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSlug = void 0;
const makeSlug = (name, timestamp = null) => {
    const slug = name
        .trim()
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/(\-)\1+/gi, (str, match) => {
        return match[0];
    });
    return timestamp ? `${slug}-${timestamp}` : slug;
};
exports.makeSlug = makeSlug;
