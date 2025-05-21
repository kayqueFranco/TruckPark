
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
    notaWindow: () => ipcRenderer.send('nota-Window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient:(client) => ipcRenderer.send('new-client',client),
    newNota : (Nota) => ipcRenderer.send('new-nota',Nota),
    resetForm:(args) => ipcRenderer.on('resert-form',args),
    searchName: (name) => ipcRenderer.send('search-Name',name),
    renderClient:(dataClient) => ipcRenderer.on('render-Client',dataClient),
    validateSearch:()=> ipcRenderer.send('validate-search'),
    setClient: (args)=> ipcRenderer.on('set-client',args),
    deleteClient: (id)=> ipcRenderer.send('delete-client',id),
    updateClient:(client)=> ipcRenderer.send('update-client',client),
    searchNota: ()=> ipcRenderer.send('search-nota'),
    searchClients: (Clients) => ipcRenderer.send('search-clients',Clients),
    listClients: (clients) => ipcRenderer.on('list-clients',clients),
    validateClient:() => ipcRenderer.send('validate-client'),
   setSearch: (args)=>ipcRenderer.on('set-search',args),
   newNota:(nota)=>ipcRenderer.send('new-nota',nota),
   renderNota:(dataNota)=>ipcRenderer.on('render-nota',dataNota),
   deleteOS: (idOS) => ipcRenderer.send('delete-os', idOS),
   UpadateNota: (Nota) => ipcRenderer.send('update-nota', Nota)
   

})
