console.log("Processo principal")


const { app, BrowserWindow, nativeTheme, Menu, ipcMain,dialog,shell} = require('electron')

// Esta linha está  relacionada ao preload.js
const path = require('node:path')

// Importação dis nétodos conectar e desconectar (do modolo de conexão)
const {conectar, desconectar} = require('./database.js')



// importação do Schema Clientes da camada model
const clientModel = require('./src/models/Clientes.js')




// importação de pacote jspdf(npm i jspdf)
const {jspdf,default:jsPDF}= require ('jspdf')
  // importação de biblioteca fs (nativa do javaScript) para manipulaçãp de arquivos(no caso arquivo PDF)
  const fs = require('fs')

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
      modal:true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
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

// iniciar a conexão com o banco de dados (pedido direto do preload.js)
ipcMain.on('db-connect', async (event) => {
  let conectado = await conectar()
  // se conectado for igual a true
  if (conectado) {
    // enviar uma mensagem para o renderizador trocar o ícone
    setTimeout(() => {
      event.reply('db-status', "conectado")
    }, 500)
  }
})

// IMPORTANTE! Desconectar do banco de dados quando a aplicação for encerrada
app.on('before-quit', () => {
  desconectar()
})


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
    label: 'Relatórios',
    submenu: [
        {
            label: 'Clientes',
            click:()=>relatorioClientes()
        },
        {
            label: 'OS abertas'
        },
        {
            label: 'OS concluídas'
        }
    ]
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



// =========================================================================================
// == Cliente - CRUD Create
// recebimento do objeto que cotem  os dados do cliente
ipcMain.on('new-client',async(event,client)=>{
  // importante teste de recibimento dos dados do cliente
  console.log(client)
  // Cadastrar a estrutura de dados no banco de dados mongodb
  try {
    // Criar uma nova estrutura de dados usando a cla modelo
    // ATENÇÃO os atributos precisam ser identificados ao modelo de dados Cliente.js e os valores são  definidos pelo conteudo de objeto 
     const newClient = new clientModel({
        nomeCliente: client.nameCli,
        cpfCliente: client.cpfCli,
        foneCliente: client.telCli,
        cepCLiente: client.cepCli,
        logradouroCliente:client.lograCli,
        numeroCliente:client.numCli,
        complementoCliente: client.compliCli,
        bairroCLiente: client.bairroCli,
        cidadeCliente:client.cidadeCli,
        ufCliente: client.ufCli

     })
       //  salvar os dados do cliente no banco de dados
       await newClient.save()
       // mensagem de confomação
       dialog.showMessageBox({
         // customização 
         type:'info',
         title:"Aviso",
         message:"Cliente adicionado com sucesso",
         buttons:['ok']
       }).then((result) =>{
         // ação ao precionar o botão ok
         if(result.response === 0 ){
           // enviar um pedido para o renderizador limpar os campos e resetar as comfigurações pre defenidas
           event.reply('resert-form')

         }
   
       }) 
     } catch (error) {
       // se o erro for 11000 (cpf duplicado)enviar uma mensagem ao usuario
       if(error.code === 11000){
         dialog.showMessageBox({
           type:'error',
           title:"Atenção",
           message:"CPF ja esta cadastrado\nVerifique se digitou corretamente",
           buttons:['ok']
         }).then((result)=>{
           if(result.response === 0){
             // 
           }
         })
       }
       console.log(error)
     }
   })
   

// FIm - cliente - CROUD create
// ============================================================================================







// ==Relatório de clientes=======================================================================

async function relatorioClientes(){
  try {
    // passo 1: consultar o banco de dados e obter a listagem de clientes cadastrados por odem alfabetica
    const clientes = await clientModel.find().sort({nomeCliente:1})
    // teste de recebimento da listagem de clientes
    // console.log(clientes)
    // passo 2 : formataçãop de documento pdf (folha A4 (210x297mm))
    const doc = new jsPDF('p','mm','a4')  
    // Inserir imagem no dcumento pdf
    // imagePath(caminho da imagem que será inserida no pdf )
    //imageBase64(usp da biblioteca fs para ler o arquivo no formato png)
    const imagePath = path.join(__dirname,'src','public','img','logo.jpg')
    const imageBase64 = fs.readFileSync(imagePath,{encoding:'base64'})
    doc.addImage(imageBase64,'PNG',5,8)
    // definir o tamanho da fonte
    doc.setFontSize(16)
    // escrever um texto (titulo)
    doc.text("Reltório de clintes",14,45)//x,y (mm)
    // inserir a data atual no relatório 
    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(18)
    doc.text(`Data: ${dataAtual}`,160,10)
    // variavel de apoio na formatação
    let y =60
    // doc.text("Nome",14,y)
    doc.text("Telefone",80,y)
    doc.text("CPF",130,y)
    y += 5
    // desenha uma linha 
    doc.setLineWidth(0.5)//expessura da linha
    doc.line(10,y, 200,y)//inicio e fim
    // Renderizar os clientes cadastrado no banco
    y += 10 //espaçamnento da linha
    // percorrrer o vetor clientes(obtido do banco ) usando o laço forEcha (equivalente aolaço for) 
     clientes.forEach((c)=>{
        // adicionar outra paginar se a folha for preenchida (estratégia é saber o tamanho da folha)
        //  folha A4 y = 297mm
        if(y > 280){
          doc.addPage()
          y = 20 //resetar a variavel y 
          // redezenhar o cabeçalho
          doc.text("Nome",14,y)
          doc.text("Telefone",80,y)
          doc.text("CPF",130,y)
          y += 5
          doc.setLineWidth(0.5)
          doc.line(10,y,200,y)
          y += 10
        }
         doc.text(c.nomeCliente,14,y),
         doc.text(c.foneCliente,80,y),
         doc.text(c.cpfCliente||"N/A",130,y )
         y+=10 //quebra de linha

    }) 

    // Adicionar numeração automatica de pagina
    const paginas = doc.internal.getNumberOfPages()
    for(let i = 1; i <= paginas; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Pagina ${i} de ${paginas}`,105,290, {align:'center'})
    }


    // definir o caminho do caminho temporario
    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir,'clientes.pdf')
   

    // salvar temporariamente o arquivo
    doc.save(filePath)
    // abrir o arquivo rio aplicativo padrão de leitura de pdf do computador de usuario 
    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}


// ==Fim relatório clientes======================================================================
// ==============================================================================================