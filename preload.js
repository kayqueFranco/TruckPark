/**
 * Arquivo de pré carregamento(mais desempenho) e reforço de segurança na 
 * comunicação entre processos(IPC)
 */

// importação de recursos de frameork eletron
//contexBridge (segurança) ipcRenderer(comuicação)
const{contextBridge, ipcRenderer} = require('electron')

// expor (autorizarcomunicação entre pessoas processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('client-Window'),
    camiaoWindow: () => ipcRenderer.send('camiao-Window'),
    hentradasaidaWindow: () => ipcRenderer.send('hentradasaida-Window'),
    notaWindow: () => ipcRenderer.send('nota-Window')
})
