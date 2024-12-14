const electron = require('electron')

electron.contextBridge.exposeInMainWorld('electron', {
    loadData: (callback: (field: any) => void) => {
        electron.ipcRenderer.send('data_request')
        electron.ipcRenderer.removeAllListeners('data')
        electron.ipcRenderer.on('data', (_, data) => callback(data))
    },
    loadMemoryData: (callback: (field: any) => void) => {
        electron.ipcRenderer.send('data_memory_request')
        electron.ipcRenderer.removeAllListeners('data_memory')
        electron.ipcRenderer.on('data_memory', (_, data) => callback(data))
    },
    loadBook: (sectionIndex: number, bookIndex: number, callback: (field: any) => void) => {
        electron.ipcRenderer.send('book_request', sectionIndex, bookIndex)
        electron.ipcRenderer.removeAllListeners('book_data')
        electron.ipcRenderer.on('book_data', (_, data) => callback(data))
    },
    loadVerse: (verseIndex: number, callback: (field: any) => void) => {
        electron.ipcRenderer.send('verse_request', verseIndex)
        electron.ipcRenderer.removeAllListeners('verse_data')
        electron.ipcRenderer.on('verse_data', (_, data) => callback(data))
    },
    saveWord: (word: any) => {
        electron.ipcRenderer.send('save_word', word)
    },
    removeWord: (word: any) => {
        electron.ipcRenderer.send('remove_word', word)
    },
    registerEvents: (callback: (field: any) => void) => {
        electron.ipcRenderer.on('save_successful', (_, data) => {
        })
        electron.ipcRenderer.on('remove_successful', (_, data) => {
        })
    }
})