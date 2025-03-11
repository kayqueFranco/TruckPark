console.log("Processo principal")


const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

// Esta linha está  relacionada ao preload.js
const path = require('node:path')
//Janela principal
let win
const createWindow = () => {
  // a linha abaixo define o tema claro ou escuro
  nativeTheme.themeSource = 'light' //(Dark ou  light)
  win = new BrowserWindow({
    width: 800,
    height: 600,
    //  autoHideMenuBar: true,
    // minimizable: false,
    resizable: false,
    //ativação do preload.js
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }

  })



  // menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html')
   // recebimento dos pedidos de renderizar para abertura de janelas(botões)
   ipcMain.on('client-Window', () => {
    clientWindow()
  })

  ipcMain.on('camiao-Window', () => {
    camiaoWindow()
  })
  ipcMain.on('hentradasaida-Window', () => {
    hentradasaidaWindow()
  })
  ipcMain.on('nota-Window',()=> {
    notaWindow()
  })
  


}
// janela sobre
function aboutWindow() {
  nativeTheme.themeSource = 'light'
  //a linha abaixo obtem a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let about
  // Estabelecer uma relação hierárquia entre janelas
  if (main) {
    // criar a janela sobre
    about = new BrowserWindow({
      width: 360,
      height: 220,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: main,
      modal: true

    })
  }
 // arregar o documento html na janela
  about.loadFile('./src/views/sobre.html')


}
// janela clientes
let client
function clientWindow(){
  nativeTheme.themeSource ='light'
  const main = BrowserWindow.getFocusedWindow()
  if(main){
    client = new BrowserWindow({
      width: 1010,
      height: 720,
     // autoHideMenuBar: true,
      resizable: false,
      parent: main,
      modal:true
    })
  }
  client.loadFile('./src/views/cliente.html')
  client.center()
}
// janela camiao
let camiao
function camiaoWindow(){
  nativeTheme.themeSource ='light'
  const main = BrowserWindow.getFocusedWindow()
  if(main){
    camiao = new BrowserWindow({
      width: 1010,
      height: 720,
      //autoHideMenuBar: true,
      resizable: false,
      parent: main,
      modal:true
    })
  }
  camiao.loadFile('./src/views/camiao.html')
  camiao.center()

}
// janela de horario de entrada e saida
let horaioentradasaida
function hentradasaidaWindow(){
  nativeTheme.themeSource ='light'
  const main = BrowserWindow.getFocusedWindow()
  if(main){
    horaioentradasaida= new BrowserWindow({
      width: 1010,
      height: 720,
      //autoHideMenuBar: true,
      resizable: false,
      parent: main,
      modal:true
    })
  }
  horaioentradasaida.loadFile('./src/views/hEntradaSaida.html')
  horaioentradasaida.center()
}
// janela de emixão de nota
let nota
function notaWindow(){
  nativeTheme.themeSource ='light'
  const main = BrowserWindow.getFocusedWindow()
  if(main){
    nota = new BrowserWindow({
      width: 1010,
      height: 720,
      //autoHideMenuBar: true,
      resizable: false,
      parent: main,
      modal:true
    })
  }
  nota.loadFile('./src/views/nota.html')
  nota.center()
}


//inicial a aplicação 

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//reduizir logs não críticos
app.commandLine.appendSwitch('log-level', '3')

// Templete do menu
const template = [
  {
    label: 'Cadastro',
    submenu: [
      {
        label: 'Clientes',
        click: ()=> clientWindow()
      },
      {
        label: 'Camião',
        click: () => camiaoWindow()
      },
      {
        label: 'Horario entrada e saida',
        click: () => hentradasaidaWindow()
      },
      {
        label: 'emixão de nota',
        click: () => notaWindow()
      },
      {
        type: 'separator'
      },
      {
        label: 'sair',
        click: () => app.quit(),
        acelereitor: 'ALt+F4'
      }
    ]
  },
  {
    label: 'Relatório'
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restauraro zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'Ferramentas do desenvolvedor',
        role: 'toggleDevTools'
      }

    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'sobre',
        click: () => aboutWindow()   
      }
    ]
  }
]