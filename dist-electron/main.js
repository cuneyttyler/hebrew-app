import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import readCsv from './csvReader.js';
import jsonexport from 'jsonexport';
import fs from 'fs';
import { readFileSync } from 'original-fs';
app.on('ready', async () => {
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: getPreloadPath()
        },
        icon: path.join(app.getAppPath(), '/build/icon.png')
    });
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    }
    else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-vue/index.html'));
    }
    ipcMain.on('data_request', async () => {
        mainWindow.webContents.send("data", await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data.csv' : '../data/data.csv')));
    });
    ipcMain.on('data_memory_request', async () => {
        mainWindow.webContents.send("data_memory", await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv')));
    });
    ipcMain.on('book_request', async (_, sectionIndex, bookIndex) => {
        let book = null;
        if (sectionIndex == 0) {
            switch (bookIndex) {
                case 0:
                    book = 'genesis';
                    break;
                case 1:
                    book = 'exodus';
                    break;
                case 2:
                    book = 'leviticus';
                    break;
                case 3:
                    book = 'numbers';
                    break;
                case 4:
                    book = 'deuteronomy';
                    break;
            }
        }
        else if (sectionIndex == 1) {
            switch (bookIndex) {
                case 0:
                    book = 'joshua';
                    break;
                case 1:
                    book = 'judges';
                    break;
                case 2:
                    book = 'samuel_I';
                    break;
                case 3:
                    book = 'samuel_II';
                    break;
                case 4:
                    book = 'kings_I';
                    break;
                case 5:
                    book = 'kings_II';
                    break;
                case 6:
                    book = 'isaiah';
                    break;
                case 7:
                    book = 'jeremiah';
                    break;
                case 8:
                    book = 'ezekiel';
                    break;
            }
        }
        else if (sectionIndex == 2) {
            switch (bookIndex) {
                case 0:
                    book = 'hosea';
                    break;
                case 1:
                    book = 'joel';
                    break;
                case 2:
                    book = 'amos';
                    break;
                case 3:
                    book = 'obadiah';
                    break;
                case 4:
                    book = 'jonah';
                    break;
                case 5:
                    book = 'micah';
                    break;
                case 6:
                    book = 'nahum';
                    break;
                case 7:
                    book = 'habakkuk';
                    break;
                case 8:
                    book = 'zephaniah';
                    break;
                case 9:
                    book = 'haggai';
                    break;
                case 10:
                    book = 'zechariah';
                    break;
                case 11:
                    book = 'malachi';
                    break;
            }
        }
        else if (sectionIndex == 3) {
            switch (bookIndex) {
                case 0:
                    book = 'psalms';
                    break;
                case 1:
                    book = 'proverbs';
                    break;
                case 2:
                    book = 'job';
                    break;
                case 3:
                    book = 'song_of_songs';
                    break;
                case 4:
                    book = 'ruth';
                    break;
                case 5:
                    book = 'lamentations';
                    break;
                case 6:
                    book = 'ecclesiastes';
                    break;
                case 7:
                    book = 'esther';
                    break;
                case 8:
                    book = 'daniel';
                    break;
                case 9:
                    book = 'ezra';
                    break;
                case 10:
                    book = 'nehemiah';
                    break;
                case 11:
                    book = 'chronicles_I';
                    break;
                case 12:
                    book = 'chronicles_II';
                    break;
            }
        }
        const book_en = JSON.parse(readFileSync(path.join(app.getAppPath(), isDev() ? '/data/' + book + '.json' : '../data/' + book + '.json'), 'utf8'));
        const book_he = JSON.parse(readFileSync(path.join(app.getAppPath(), isDev() ? '/data/' + book + '_hebrew.json' : '../data/' + book + '_hebrew.json'), 'utf8'));
        mainWindow.webContents.send("book_data", { "en": book_en.text, "he": book_he.text });
    });
    ipcMain.on('verse_request', async (_, verseIndex) => {
        let file = null;
        let bookIndex = verseIndex[1];
        switch (parseInt(verseIndex[0])) {
            case 1:
                file = 'pantateuch_data.csv';
                break;
            case 2:
                file = 'prophets_data.csv';
                bookIndex = parseInt(verseIndex[1]) + 5;
                break;
            case 3:
                file = 'minor_prophets_data.csv';
                bookIndex = parseInt(verseIndex[1]) + 14;
                break;
            case 4:
                file = 'writings_data.csv';
                bookIndex = parseInt(verseIndex[1]) + 26;
                break;
        }
        const data = await readCsv(path.join(app.getAppPath(), isDev() ? '/data/' + file : '../data/' + file));
        console.log('bookIndex: ' + bookIndex);
        console.log('verseIndex: ' + JSON.stringify(verseIndex));
        console.log('file: ' + file);
        const lemmas = data.filter((d) => parseInt(d.Book) == parseInt(bookIndex) && parseInt(d.Chapter) == parseInt(verseIndex[2]) && parseInt(d.Verse) == parseInt(verseIndex[3]));
        const result = [];
        lemmas.forEach((l) => {
            result.push({ 'fullForm': l.uMorph, 'lemma': l.uLemma });
        });
        mainWindow.webContents.send("verse_data", result);
    });
    ipcMain.on('save_word', async (_, word) => {
        let data = await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'));
        data.push(word);
        jsonexport(data, { rowDelimiter: '\t' }, (err, csv) => {
            if (err) {
                console.error(err);
                return;
            }
            fs.writeFileSync(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'), csv);
            mainWindow.webContents.send("save_successful");
        });
    });
    ipcMain.on('remove_word', async (_, word) => {
        let data = await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'));
        let index = data.findIndex((w) => w.Id == word.Id);
        if (index == -1) {
            console.error("Can't find word. Not removing");
            return;
        }
        data.splice(index, 1);
        jsonexport(data, { rowDelimiter: '\t' }, (err, csv) => {
            if (err) {
                console.error(err);
                return;
            }
            fs.writeFileSync(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'), csv);
            mainWindow.webContents.send("remove_successful");
        });
    });
});
