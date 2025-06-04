
const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

const path = require('node:path')

const mongose = require('mongoose')

const { conectar, desconectar } = require('./database.js')

const clientModel = require('./src/models/Clientes.js')

const notaModel = require('./src/models/Nota.js')

const { jspdf, default: jsPDF } = require('jspdf')

const fs = require('fs')

const prompt = require('electron-prompt')
const { type } = require('node:os')


let win
const createWindow = () => {

  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 800,
    height: 600,


    resizable: false,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }

  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html')

  ipcMain.on('client-Window', () => {
    clientWindow()
  })


  ipcMain.on('nota-Window', () => {
    notaWindow()
  })

}

function aboutWindow() {
  nativeTheme.themeSource = 'light'

  const main = BrowserWindow.getFocusedWindow()
  let about

  if (main) {

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

  about.loadFile('./src/views/sobre.html')


}

let client
function clientWindow() {
  nativeTheme.themeSource = 'light'
  const main = BrowserWindow.getFocusedWindow()
  if (main) {
    client = new BrowserWindow({
      width: 1010,
      height: 720,

      resizable: false,
      parent: main,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  client.loadFile('./src/views/cliente.html')
  client.center()
}

let nota
function notaWindow() {
  nativeTheme.themeSource = 'light'
  const main = BrowserWindow.getFocusedWindow()
  if (main) {
    nota = new BrowserWindow({
      width: 1050,
      height: 740,

      resizable: false,
      parent: main,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

  }
  nota.loadFile('./src/views/nota.html')
  nota.center()
}

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

app.commandLine.appendSwitch('log-level', '3')

ipcMain.on('db-connect', async (event) => {
  let conectado = await conectar()

  if (conectado) {

    setTimeout(() => {
      event.reply('db-status', "conectado")
    }, 500)
  }
})

app.on('before-quit', () => {
  desconectar()
})

const template = [
  {
    label: 'Cadastro',
    submenu: [
      {
        label: 'Clientes',
        click: () => clientWindow()
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
        click: () => relatorioClientes()
      },
      {
        label: 'OS abertas',
        click: () => relatorioOSAbertas()
      },
      {
        label: 'OS concluídas',
        click: () => relatorioOSFinalizado()
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

ipcMain.on('new-client', async (event, client) => {

  try {


    const newClient = new clientModel({
      nomeCliente: client.nameCli,
      cpfCliente: client.cpfCli,
      foneCliente: client.telCli,
      cepCLiente: client.cepCli,
      logradouroCliente: client.lograCli,
      numeroCliente: client.numCli,
      complementoCliente: client.compliCli,
      bairroCLiente: client.bairroCli,
      cidadeCliente: client.cidadeCli,
      ufCliente: client.ufCli

    })

    await newClient.save()

    dialog.showMessageBox({

      type: 'info',
      title: "Aviso",
      message: "Cliente adicionado com sucesso",
      buttons: ['ok']
    }).then((result) => {

      if (result.response === 0) {

        event.reply('resert-form')

      }

    })
  } catch (error) {

    if (error.code === 11000) {
      dialog.showMessageBox({
        type: 'error',
        title: "Atenção",
        message: "CPF ja esta cadastrado\nVerifique se digitou corretamente",
        buttons: ['ok']
      }).then((result) => {
        if (result.response === 0) {

        }
      })
    }
    console.log(error)
  }
})

async function relatorioClientes() {
  try {

    const clientes = await clientModel.find().sort({ nomeCliente: 1 })



    const doc = new jsPDF('p', 'mm', 'a4')



    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.jpg')
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    doc.addImage(imageBase64, 'PNG', 5, 8)

    doc.setFontSize(16)

    doc.text("Reltório de clientes", 14, 45)

    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(18)
    doc.text(`Data: ${dataAtual}`, 160, 10)

    let y = 60
    doc.text("Nome", 14, y)
    doc.text("Telefone", 100, y)
    doc.text("CPF", 150, y)
    y += 5

    doc.setLineWidth(0.5)
    doc.line(10, y, 200, y)

    y += 10

    clientes.forEach((c) => {


      if (y > 280) {
        doc.addPage()
        y = 20

        doc.text("Nome", 14, y)
        doc.text("Telefone", 100, y)
        doc.text("CPF", 150, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
      }
      doc.text(c.nomeCliente, 14, y),
        doc.text(c.foneCliente, 100, y),
        doc.text(c.cpfCliente || "N/A", 150, y)
      y += 10

    })


    const paginas = doc.internal.getNumberOfPages()
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
    }



    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'clientes.pdf')



    doc.save(filePath)

    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

ipcMain.on('validate-search', () => {
  dialog.showMessageBox({
    type: 'warning',
    title: 'Atenção',
    message: "Prencha o campo de busca",
    buttons: ['OK']
  })
})

ipcMain.on('search-Name', async (event, name) => {

  try {
    const dataClient = await clientModel.find({
      $or: [
        { nomeCliente: new RegExp(name, 'i') },
        { cpfCliente: new RegExp(name, 'i') }
      ]
    })
    console.log(dataClient)




    if (dataClient.length === 0) {
      dialog.showMessageBox({
        type: 'warning',
        title: "Aviso",
        message: "Cliente não cadastado. \n deseja cadastrar esse cliente?",
        defaultId: 0,
        buttons: ['Sim', 'Não']


      }).then((result) => {
        if (result.response === 0) {

          event.reply('set-client')
        } else {

          event.reply('resert-form')
        }
      })
    }

    event.reply('render-Client', JSON.stringify(dataClient))
  } catch (error) {
    console.log(error)
  }

})

ipcMain.on('delete-client', async (event, id) => {

  try {


    const { response } = await dialog.showMessageBox(client, {
      type: 'warning',
      title: "Atenção!",
      message: "Deseja excluir esse cliente?\nEsta ação não podera ser desfeita.",
      buttons: ['cancelar', 'Excluir']
    })
    if (response === 1) {
      console.log("teste do if de exclusão")

      const delClient = await clientModel.findByIdAndDelete(id)
      event.reply('resert-form')
    }
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('update-client', async (event, client) => {

  try {


    const updateClient = await clientModel.findByIdAndUpdate(
      client.idCli,
      {
        nomeCliente: client.nameCli,
        cpfCliente: client.cpfCli,
        foneCliente: client.telCli,
        cepCLiente: client.cepCli,
        logradouroCliente: client.lograCli,
        numeroCliente: client.numCli,
        complementoCliente: client.compliCli,
        bairroCLiente: client.bairroCli,
        cidadeCliente: client.cidadeCli,
        ufCliente: client.ufCli

      },
      {
        new: true

      }
    )


    dialog.showMessageBox({

      type: 'info',
      title: "Aviso",
      message: " Dados do cliente alterados com sucesso",
      buttons: ['ok']
    }).then((result) => {

      if (result.response === 0) {

        event.reply('resert-form')

      }

    })
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('validate-client', (event) => {
  dialog.showMessageBox({
    type: "warning",
    title: "Aviso!",
    message: "É obrigatório vincular o cliente na ordem de serviço",
    buttons: ['OK']
  }).then((result) => {
    if (result.response === 0) {
      event.reply('set-search')
    }
  })
})

ipcMain.on('new-nota', async (event, Nota) => {


  try {
    const newNota = new notaModel({
      NumNota: Nota.nNota,
      NomeNota: Nota.NameN,
      IdCliente: Nota.idCli,
      PlacaNota: Nota.PlacN,

      DataEntradaNota: Nota.Dentradanota,
      DataSaidaNota: Nota.Dsaidanota,
      RelatorioNota: Nota.RelaNota,
      OrcamentoNota: Nota.orcaNota,
      PagamentoNota: Nota.formNota,
      StatusNota: Nota.statusNota
    })
    await newNota.save()

    const osId = newNota._id
    console.log("ID da nova OS:", osId)


    dialog.showMessageBox({

      type: 'info',
      title: "Aviso",
      message: "OS gerada com sucesso.\nDeseja imprimir esta OS?",
      buttons: ['Sim', 'Não']
    }).then((result) => {

      if (result.response === 0) {

        printOS(osId)

        event.reply('resert-form')
      } else {

        event.reply('resert-form')
      }
    })
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('search-nota', async (event) => {
  prompt({
    title: 'Busca Nota',
    label: 'Digite  o número da Nota:',
    inputAttrs: {
      type: 'text'
    },
    type: 'input',
    width: 400,
    height: 200
  }).then(async (result) => {
    if (result !== null) {

      if (mongose.Types.ObjectId.isValid(result)) {
        try {
          const dataNota = await notaModel.findById(result)
          if (dataNota) {
            console.log(dataNota)
            event.reply('render-nota', JSON.stringify(dataNota))
          } else {
            dialog.showMessageBox({
              type: 'warning',
              title: "Aviso!",
              message: "Nota não encontrada",
              buttons: ['OK']
            })
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        dialog.showMessageBox({
          type: 'error',
          title: "Atenção!",
          message: "Formato fo número da Nota inválido.\nVerifique e tente novmente.",
          buttons: ['OK']
        })
      }
    }
  })
})

ipcMain.on('search-clients', async (event) => {
  try {

    const clients = await clientModel.find().sort({ nomeCliente: 1 })


    console.log(clients)



    event.reply('list-clients', JSON.stringify(clients))
  } catch (error) {
    console.log(error)
  }
})

async function relatorioOSAbertas() {
  try {

    const clientes = await notaModel.find({ StatusNota: 'Aberta' }).sort({ Aberta: 1 })

    const doc = new jsPDF('p', 'mm', 'a4')

    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.jpg')
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    doc.addImage(imageBase64, 'PNG', 20, 8)

    doc.setFontSize(18)

    doc.text("Relatório Da Nota", 14, 45)

    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(12)
    doc.text(`Data: ${dataAtual}`, 160, 10)

    let y = 60
    doc.text("Nome do cliente", 14, y)
    doc.text("Status da os", 70, y)
    doc.text("Placa", 120, y)

    y += 5

    doc.setLineWidth(0.5)
    doc.line(10, y, 200, y)

    y += 10

    clientes.forEach((c) => {

      if (y > 280) {
        doc.addPage()
        y = 20
        doc.text("Nome do cliente", 14, y)
        doc.text("Status da os", 70, y)
        doc.text("Placa", 120, y)

        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
      }
      
  
      doc.text(c.NomeNota || "N/A", 14, y)
      doc.text(c.StatusNota || "N/A", 70, y)
      doc.text(c.PlacaNota || "N/A", 120, y)

      y += 10
    })

    const paginas = doc.internal.getNumberOfPages()
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
    }

    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'ordemservico.pdf')

    doc.save(filePath)

    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

async function relatorioOSFinalizado() {
  try {

    const clientes = await notaModel.find({ StatusNota: 'Finalizada' }).sort({ Aberta: 1 })

    const doc = new jsPDF('p', 'mm', 'a4')

    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.jpg')
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    doc.addImage(imageBase64, 'PNG', 20, 8)

    doc.setFontSize(18)

    doc.text("Relatório da Nota ", 14, 45)

    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(12)
    doc.text(`Data: ${dataAtual}`, 160, 10)

    let y = 60
    doc.text("Nome do cliente", 14, y)
    doc.text("Status da os", 70, y)
    doc.text("Placa", 120, y)

    y += 5

    doc.setLineWidth(0.5)
    doc.line(10, y, 200, y)

    y += 10

    clientes.forEach((c) => {

      if (y > 280) {
        doc.addPage()
        y = 20
        doc.text("Nome do cliente", 14, y)
        doc.text("Status da os", 70, y)
        doc.text("Placa", 120, y)

        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
      }
      
  
      doc.text(c.NomeNota || "N/A", 14, y)
      doc.text(c.StatusNota || "N/A", 70, y)
      doc.text(c.PlacaNota || "N/A", 120, y)

      y += 10
    })

    const paginas = doc.internal.getNumberOfPages()
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
    }

    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'ordemservico.pdf')

    doc.save(filePath)

    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

ipcMain.on('delete-os', async (event, idOS) => {

  try {


    const { response } = await dialog.showMessageBox(nota, {
      type: 'warning',
      title: "Atenção!",
      message: "Deseja excluir esta ordem de serviço?\nEsta ação não poderá ser desfeita.",
      buttons: ['Cancelar', 'Excluir']
    })
    if (response === 1) {


      const delOS = await notaModel.findByIdAndDelete(idOS)
      event.reply('resert-form')
    }
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('update-nota', async (event, Nota) => {
  try {
    console.log('Dados recebidos para update:', Nota)

    const updateOS = await notaModel.findByIdAndUpdate(
      Nota.idOS,
      {
        IdCliente: Nota.IdCliente,
        PlacaNota: Nota.PlacaNota,
        DataEntradaNota: Nota.DataEntradaNota,
        DataSaidaNota: Nota.DataSaidaNota,
        RelatorioNota: Nota.RelatorioNota,
        OrcamentoNota: Nota.OrcamentoNota,
        PagamentoNota: Nota.PagamentoNota,
        StatusNota: Nota.StatusNota
      },
      { new: true }
    )

    console.log('Resultado do update:', updateOS)

    dialog.showMessageBox({
      type: 'info',
      title: "Aviso",
      message: "Dados da OS alterados com sucesso",
      buttons: ['OK']
    }).then(result => {
      if (result.response === 0) {
        event.reply('resert-form')
      }
    })

  } catch (error) {
    console.error('Erro no update:', error)
  }
})

ipcMain.on('print-os', async (event) => {
  prompt({
    title: 'Imprimir OS',
    label: 'Digite o número da Nota:',
    inputAttrs: { type: 'text' },
    type: 'input',
    width: 400,
    height: 200
  }).then(async (result) => {
    if (result !== null && mongose.Types.ObjectId.isValid(result)) {
      try {
        const dataNota = await notaModel.findById(result)
        if (!dataNota) {
          return dialog.showMessageBox({
            type: 'warning',
            title: "Aviso!",
            message: "Nota não encontrada",
            buttons: ['OK']
          })
        }

        const clients = await clientModel.find({ _id: dataNota.IdCliente })


        const doc = new jsPDF('p', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.jpg')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(18)
        doc.text("Nota", 14, 45)


        let y = 55


        doc.setFontSize(12)
        clients.forEach((c) => {
          doc.text(`Cliente: ${c.nomeCliente || "N/A"}`, 14, y)
          y += 7
          doc.text(`ID Cliente: ${String(c._id)}`, 14, y)
          y += 10
        })


        doc.text(`Relatório: ${dataNota.RelatorioNota || "N/A"}`, 14, y)
        y += 7
        doc.text(`Placa: ${dataNota.PlacaNota || "N/A"}`, 14, y)
        y += 7
        doc.text(`Status: ${dataNota.StatusNota || "N/A"}`, 14, y)
        y += 10


        doc.setFontSize(10)
        const termo = `Objeto do serviço
Estabelece que o serviço prestado é a guarda temporária do(s) caminhão(ões) nas dependências do estacionamento, mediante pagamento e sob condições previamente acordadas.
  Base legal: Art. 593 do Código Civil (contrato de depósito).

Garantia oferecida pelo estabelecimento
O estacionamento garante a guarda do veículo em segurança, com vigilância e/ou monitoramento, responsabilizando-se por danos causados por culpa ou dolo de seus prepostos (funcionários).
  Base legal: Art. 932 e 933 do Código Civil.

Limitações da garantia
O estabelecimento não se responsabiliza por:
- Objetos pessoais deixados no interior do veículo;
- Danos causados por terceiros ou por caso fortuito/força maior (ex: enchentes, raios);
- Falhas mecânicas não relacionadas ao serviço.
  Base legal: Art. 393 do Código Civil (força maior), Art. 14, §3º, II do CDC (excludentes de responsabilidade).

Responsabilidades do usuário
O usuário deve entregar o veículo em condições normais, sem objetos de valor visíveis, e retirar seus pertences antes do estacionamento. Deve também apresentar o comprovante de entrada para retirada do veículo.
  Base legal: Dever de boa-fé objetiva — Art. 422 do Código Civil.

Procedimentos de entrada e saída do veículo
A entrada e saída do caminhão devem ser registradas com data, hora, identificação do veículo e vistoria (quando aplicável). A apresentação do comprovante de entrada é obrigatória para liberação do veículo.
  Base legal: Princípio da segurança contratual e da boa-fé (Art. 421 e 422 do Código Civil).

Vigência da garantia
A responsabilidade do estabelecimento começa com a entrada do veículo no estacionamento e termina com a sua retirada mediante apresentação do comprovante.
  Base legal: Art. 627 e 628 do Código Civil (prazo do contrato de depósito).

Foro para resolução de conflitos
Em caso de disputa judicial, fica eleito o foro da comarca onde se localiza o estacionamento ou onde reside o consumidor, conforme escolha do consumidor.
  Base legal: Art. 101, I do CDC (foro do domicílio do consumidor).`

        doc.text(termo, 14, y, { maxWidth: 180 })


        const filePath = path.join(app.getPath('temp'), 'os.pdf')
        doc.save(filePath)
        shell.openPath(filePath)

      } catch (error) {
        console.error("Erro ao gerar PDF da OS:", error)
      }
    } else {
      dialog.showMessageBox({
        type: 'error',
        title: "Atenção!",
        message: "Código da OS inválido.\nVerifique e tente novamente.",
        buttons: ['OK']
      })
    }
  })
})

async function printOS(osId) {
  try {
    const dataNota = await notaModel.findById(osId)

    if (!dataNota) {
      console.log("Nota  não encontrada.")
      return
    }

    const clients = await clientModel.find({ _id: dataNota.IdCliente })
    if (!clients || clients.length === 0) {
      console.log("Cliente não encontrado.")
      return
    }


    const doc = new jsPDF('p', 'mm', 'a4')
    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.jpg')
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    doc.addImage(imageBase64, 'PNG', 5, 8)

    doc.setFontSize(18)
    doc.text("Nota ", 14, 45)

    let y = 55


    doc.setFontSize(12)
    clients.forEach((c) => {
      doc.text(`Cliente: ${c.nomeCliente || "N/A"}`, 14, y)
      y += 7
      doc.text(`ID Cliente: ${String(c._id)}`, 14, y)
      y += 10
    })


    doc.text(`Relatório: ${dataNota.id || "N/A"}`, 14, y)
    y += 7
    doc.text(`Relatório: ${dataNota.RelatorioNota || "N/A"}`, 14, y)
    y += 7
    doc.text(`Placa: ${dataNota.PlacaNota || "N/A"}`, 14, y)
    y += 7
    doc.text(`Status: ${dataNota.StatusNota || "N/A"}`, 14, y)
    y += 10


    doc.setFontSize(10)
    const termo = `Objeto do serviço
Estabelece que o serviço prestado é a guarda temporária do(s) caminhão(ões) nas dependências do estacionamento, mediante pagamento e sob condições previamente acordadas.
  Base legal: Art. 593 do Código Civil (contrato de depósito).

Garantia oferecida pelo estabelecimento
O estacionamento garante a guarda do veículo em segurança, com vigilância e/ou monitoramento, responsabilizando-se por danos causados por culpa ou dolo de seus prepostos (funcionários).
  Base legal: Art. 932 e 933 do Código Civil.

Limitações da garantia
O estabelecimento não se responsabiliza por:
- Objetos pessoais deixados no interior do veículo;
- Danos causados por terceiros ou por caso fortuito/força maior (ex: enchentes, raios);
- Falhas mecânicas não relacionadas ao serviço.
  Base legal: Art. 393 do Código Civil (força maior), Art. 14, §3º, II do CDC (excludentes de responsabilidade).

Responsabilidades do usuário
O usuário deve entregar o veículo em condições normais, sem objetos de valor visíveis, e retirar seus pertences antes do estacionamento. Deve também apresentar o comprovante de entrada para retirada do veículo.
  Base legal: Dever de boa-fé objetiva — Art. 422 do Código Civil.

Procedimentos de entrada e saída do veículo
A entrada e saída do caminhão devem ser registradas com data, hora, identificação do veículo e vistoria (quando aplicável). A apresentação do comprovante de entrada é obrigatória para liberação do veículo.
  Base legal: Princípio da segurança contratual e da boa-fé (Art. 421 e 422 do Código Civil).

Vigência da garantia
A responsabilidade do estabelecimento começa com a entrada do veículo no estacionamento e termina com a sua retirada mediante apresentação do comprovante.
  Base legal: Art. 627 e 628 do Código Civil (prazo do contrato de depósito).

Foro para resolução de conflitos
Em caso de disputa judicial, fica eleito o foro da comarca onde se localiza o estacionamento ou onde reside o consumidor, conforme escolha do consumidor.
  Base legal: Art. 101, I do CDC (foro do domicílio do consumidor).`


    doc.text(termo, 14, y, { maxWidth: 180 })


    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'os.pdf')
    doc.save(filePath)
    shell.openPath(filePath)

  } catch (error) {
    console.error("Erro ao gerar o PDF da OS:", error)
  }
}
