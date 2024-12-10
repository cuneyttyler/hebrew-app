"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require('electron');
electron.contextBridge.exposeInMainWorld('electron', {
    loadData: (callback) => {
        electron.ipcRenderer.send('data_request');
        electron.ipcRenderer.removeAllListeners('data_request');
        electron.ipcRenderer.on('data', (_, data) => callback(data));
    },
    loadMemoryData: (callback) => {
        electron.ipcRenderer.send('data_memory_request');
        electron.ipcRenderer.removeAllListeners('data_memory');
        electron.ipcRenderer.on('data_memory', (_, data) => callback(data));
    },
    saveWord: (word) => {
        console.log("SaveWord");
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
