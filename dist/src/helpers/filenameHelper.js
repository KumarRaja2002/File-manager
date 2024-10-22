"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileNameHelper = void 0;
const app_utils_1 = require("../utils/app.utils");
const fileNameHelper = async (fileData) => {
    const fileName = fileData.original_name;
    let [fileOriginalName, fileExtension] = fileName.split('.');
    // Remove spaces and special characters from the fileOriginalName
    fileOriginalName = (0, app_utils_1.makeSlug)(fileOriginalName);
    // Get the current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    // Get the current time and format it (HHmmss)
    const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '');
    // Construct the unique filename with date and time
    const uniqueFileName = `${formattedDate}_${formattedTime}_${fileOriginalName}.${fileExtension}`;
    return uniqueFileName;
};
exports.fileNameHelper = fileNameHelper;
