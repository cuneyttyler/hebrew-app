"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
electron.contextBridge.exposeInMainWorld('electron', {
    loadData: (callback) => {
        electron.ipcRenderer.send('data_request');
        electron.ipcRenderer.removeAllListeners('data');
        electron.ipcRenderer.on('data', (_, data) => callback(data));
    },
    loadMemoryData: (callback) => {
        electron.ipcRenderer.send('data_memory_request');
        electron.ipcRenderer.removeAllListeners('data_memory');
        electron.ipcRenderer.on('data_memory', (_, data) => callback(data));
    },
    loadBook: (sectionIndex, bookIndex, callback) => {
        electron.ipcRenderer.send('book_request', sectionIndex, bookIndex);
        electron.ipcRenderer.removeAllListeners('book_data');
        electron.ipcRenderer.on('book_data', (_, data) => callback(data));
    },
    loadVerse: (verseIndex, callback) => {
        electron.ipcRenderer.send('verse_request', verseIndex);
        electron.ipcRenderer.removeAllListeners('verse_data');
        electron.ipcRenderer.on('verse_data', (_, data) => callback(data));
    },
    saveWord: (word) => {
        electron.ipcRenderer.send('save_word', word);
    },
    removeWord: (word) => {
        electron.ipcRenderer.send('remove_word', word);
    },
    registerEvents: (callback) => {
        electron.ipcRenderer.on('save_successful', (_, data) => {
        });
        electron.ipcRenderer.on('remove_successful', (_, data) => {
        });
    }
});
