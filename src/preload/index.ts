import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Definimos tu API personalizada con un nombre único para evitar conflictos
const customWindowControls = {
  minimize: () => ipcRenderer.send('window-control', 'minimize'),
  maximize: () => ipcRenderer.send('window-control', 'maximize'),
  close: () => ipcRenderer.send('window-control', 'close')
}

if (process.contextIsolated) {
  try {
    // Mantenemos la de la librería
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // Exponemos la tuya con el nombre que el Renderer espera
    contextBridge.exposeInMainWorld('electronAPI', customWindowControls)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.electronAPI = customWindowControls
}