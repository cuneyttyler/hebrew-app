import fs from 'fs';
// @ts-ignore
import csvParser from 'csv-parser'

export default function readCsv(file: string): Promise<any> {
  return new Promise((resolve) => {
    const results: Array<any> = []

    fs.createReadStream(file)
      .pipe(csvParser({separator: '\t'}))
      .on('data', (data: any) => results.push(data))
      .on('end', () => {
        resolve(results)
      });
  })
}