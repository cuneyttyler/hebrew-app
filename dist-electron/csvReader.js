import fs from 'fs';
// @ts-ignore
import csvParser from 'csv-parser';
export default function readCsv(file) {
    return new Promise((resolve) => {
        const results = [];
        fs.createReadStream(file)
            .pipe(csvParser({ separator: '\t' }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
            resolve(results);
        });
    });
}
