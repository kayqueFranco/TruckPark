
/**
 * Arquivo de pré carregamento e reforço de segurança na comunicação entre processos (IPC)
 */

// importação dos recursos do framework electron
// contextBrigde (segurança) ipcRenderer (comunicação)
const { contextBridge, ipcRenderer } = require('electron')


// enviar ao main um pedido para conexão com o banco de dados e troca do icone no processo de renderização (index.html - renderer.html)
ipcRenderer.send('db-connect')

// expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('client-Window'),
    camiaoWindow: () => ipcRenderer.send('camiao-Window'),
    hentradasaidaWindow: () => ipcRenderer.send('hentradasaida-Window'),
    notaWindow: () => ipcRenderer.send('nota-Window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient:(client) => ipcRenderer.send('new-client',client),
    newNota : (Nota) => ipcRenderer.send('new-nota',Nota),
    newCaminhao: (caminhao) => ipcRenderer.send('new-caminhao',caminhao),
    resetForm:(args) => ipcRenderer.on('resert-form',args)

})
