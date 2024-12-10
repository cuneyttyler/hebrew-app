import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import { isDev } from './util.js'
import { getPreloadPath } from './pathResolver.js'
import readCsv from './csvReader.js'
import jsonExport from 'jsonexport'
import jsonexport from 'jsonexport'
import fs from 'fs'

app.on('ready', async () => {
    const mainWindow = new BrowserWindow({
        width: 1600, 
        height: 900,
        webPreferences: {
            preload: getPreloadPath()
        },
        icon: path.join(app.getAppPath(), '/build/icon.png')
    })
    if(isDev()) {
        mainWindow.loadURL('http://localhost:5123')
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-vue/index.html'))
    }
    
    ipcMain.on('data_request', async () => {
        mainWindow.webContents.send("data", await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data.csv' : '../data/data.csv')))
    })

    ipcMain.on('data_memory_request', async () => {
        mainWindow.webContents.send("data_memory", await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv')))
    })

    ipcMain.on('save_word', async (_, word: Word) => {
        let data: Array<Word> = await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'))
        data.push(word)

        jsonexport(data, {rowDelimiter: '\t'},(err: any, csv: any) => {
            if(err) {
                console.error(err)
                return
            }
            fs.writeFileSync(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'), csv)
            mainWindow.webContents.send("save_successful")
        })
    })

    ipcMain.on('remove_word', async (_, word: any) => {
        let data = await readCsv(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'))
        let index = data.findIndex((w: any) => w.Id == word.Id)
        if(index == -1) {
            console.error("Can't find word. Not removing")
            return
        }
        data.splice(index, 1)
        jsonexport(data, {rowDelimiter: '\t'}, (err: any, csv: any) => {
            if(err) {
                console.error(err)
                return
            }
            fs.writeFileSync(path.join(app.getAppPath(), isDev() ? '/data/data_memory.csv' : '../data/data_memory.csv'), csv)
            mainWindow.webContents.send("remove_successful")
        })
    })

})