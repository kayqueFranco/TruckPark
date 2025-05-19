document.addEventListener('DOMContentLoaded',()=>{
    btnUpdate.disabled = true
    btnDelete.disabled = true

})


// captura dos dados dos input do formulario (passo1 :Fluxo)
let frmNota = document.getElementById('frmNota')
let nameNota = document.getElementById('inputNameNota')
let idClient = document.getElementById('iputidClient')
let placNota = document.getElementById('inputPlacNota')
let Dentradanota = document.getElementById('inputDentradanota')
let Dsaidanota = document.getElementById('inputDsaidanota')
let Relatorionota = document.getElementById('inputRelatorionota')
let Orcamento = document.getElementById('inputOrcamento')
let Fpagamento = document.getElementById('inputFpagamento')
let notaStatus = document.getElementById('notaStatus')
let id = document.getElementById('inputNota')
let dateOS = document.getElementById('inputData')






frmNota.addEventListener('submit', async (event) => {
    event.preventDefault()

    //     Validação do campo obrigatório padrão 'idClient'(validação html não funcniona via html par Campos desativados)
    if (idClient.value === "") {
        api.validateClient()
    } else {
        //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
        console.log(nameNota.value, idClient.value, placNota.value, Dentradanota.value, Dsaidanota.value, Relatorionota.value, Orcamento.value, Fpagamento.value, notaStatus.value, id.value)

        if (id.value === "") {
            // Criar um objeto para armazenar os dados do cliente amtes de enviar ao main
            const Nota = {
                

                NameN: nameNota.value,
                PlacN: placNota.value,
                idCli: idClient.value,
                Dentradanota: Dentradanota.value,
                Dsaidanota: Dsaidanota.value,
                RelaNota: Relatorionota.value,
                orcaNota: Orcamento.value,
                formNota: Fpagamento.value,
                statusNota: notaStatus.value


            }
            // Enviar ao main o objeto client - (Passo 2: fluxo)
            // uso do preload.js
            api.newNota(Nota)
        }else{
            // editar
            const Nota ={
                
                placNota: placNota.value,
                Dentradanota: Dentradanota.value,
                Dsaidanota:Dsaidanota.value,
                RelaNota: Relatorionota.value,
                orcaNota:Orcamento.value,
                formNota:Fpagamento.value,
                statusNota:notaStatus.value
                
            }
            api.UpadateNota(Nota)
        }

    }

})

// =====================================================
// ==================Buscar Os - CRUD Read==============
function findOS(){
    api.searchNota()
}
 
api.renderNota((event,dataNota)=>{
    console.log(dataNota)
     const nota = JSON.parse(dataNota)
     id.value = nota._id
    
     const data = new Date(nota.dataEntrada)
     const formatada = data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
     
    dateOS.value = formatada
    placNota.value= nota. PlacaNota
    nameClient.value = nota.NomeNota
    idClient.value= nota. IdCliente
    Dentradanota.value = nota. DataEntradaNota
    Dsaidanota .value = nota. DataSaidaNota
    Relatorionota.value= nota.RelatorioNota
    Orcamento.value= nota.OrcamentoNota
    Fpagamento.value= nota.PagamentoNota
    notaStatus.value= nota.StatusNota

    
})






// =======================================================
function resetForm() {
    
    // Limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}

// recebendo do pepido do main para resetar o form
api.resetForm((args) => {
    resetForm()
})



// ===================================================================

// ============== Buscar  avançada estilo google CLiente================================
// capturar os id referente aos campos do nome
const input = document.getElementById('searchNameNota')
// capturar o id ul da lista de susgestões de cliente
const suggestionList = document.getElementById('viewListSuggestion')
// capturar os campos que vão ser prenchidos
let nameClient = document.getElementById('inputNameNota')
let IdCliente = document.getElementById('iputidClient')


// vetor usado na manipulação (filtragem) dos dados
let arrayCients = []



// captura em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input', () => {
    // Passo 1: capturar o que for digitado na caixa de busca e converter tudo para letras minusculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    ///console.log(search) // teste de apoio a logica 

    // passo 2: enviar ao main um pedido de busca de clientes pelo nome (via preload - api (IPC))
    api.searchClients()

    // Recebimentos dos clientes do banco de dados (passo 3)
    api.listClients((event, clients) => {
        ///console.log(clients) // teste do passo 3
        // converter o vetor para JSON os dados dos clientes recebidos
        const dataClients = JSON.parse(clients)
        // armazenar no vetor os dados dos clientes
        arrayCients = dataClients
        // Passo 4: Filtrar todos os dados dos clientes extraindo nomes que tenham relação com os caracteres digitados na busca em tempo real 
        const results = arrayCients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 10) // maximo 10 resultados
        ///console.log(results) // IMPORTANTE para o entendimento
        // Limpar a lista a cada caractere digitado
        suggestionList.innerHTML = ""
        // Para cada resultado gerar um item da lista <li>
        results.forEach(c => {
            // criar o elemento li
            const item = document.createElement('li')
            // Adicionar classes bootstrap a cada li criado 
            item.classList.add('list-group-item', 'list-group-item-action')
            // exibir nome do cliente
            item.textContent = c.nomeCliente

            // adicionar os lis criados a lista ul
            suggestionList.appendChild(item)


            // adiconar um evento de click no item na lista para prencher os campos do formulario
            item.addEventListener('click', () => {
                nameClient.value = c.nomeCliente
                IdCliente.value = c._id
                // limpar o input e recolher a lista
                input.value = ""
                suggestionList.value = ""
            })
        })

    })
})

// ocutar a lista ao clicar fora
document.addEventListener('click', (event) => {
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})



// ===============FIm busca avançada ====================================================






// BUscar NOta ==================================






// fim do buscar nota==================
// CRUD REAd==========================================================


