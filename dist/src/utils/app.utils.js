"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSlug = makeSlug;
function makeSlug(name) {
    //converting name to lower case then spaces replacing with '-' 
    //removing other special chars
    return name.trim().toLowerCase().replace(/[ \/\&]/g, '-') // replacing spaces with - 
        .replace(/[^\w-]+/g, '') // removing special chars
        .replace(/(\-)\1+/ig, (str, match) => {
        return match[0];
    });
}
