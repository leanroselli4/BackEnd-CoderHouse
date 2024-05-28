const fs = require('fs').promises;
const path = require('path');

const readJSONFile = async (filePath) => {
    try {
        const data = await fs.readFile(path.resolve(__dirname, '../data', filePath), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeJSONFile = async (filePath, data) => {
    try {
        await fs.writeFile(path.resolve(__dirname, '../data', filePath), JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to file', error);
    }
};

module.exports = { readJSONFile, writeJSONFile };