document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true

})


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
let idOS = document.getElementById('inputNota')
let dateOS = document.getElementById('inputData')






frmNota.addEventListener('submit', async (event) => {
    event.preventDefault()


    if (idClient.value === "") {
        api.validateClient()
    } else {

        console.log(nameNota.value, idClient.value, placNota.value, Dentradanota.value, Dsaidanota.value, Relatorionota.value, Orcamento.value, Fpagamento.value, notaStatus.value, idOS.value)

        if (idOS.value === "") {

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

            api.newNota(Nota)
        } else {
            const Nota = {
                idOS: idOS.value,
                IdCliente: idClient.value,
                PlacaNota: placNota.value,
                DataEntradaNota: Dentradanota.value,
                DataSaidaNota: Dsaidanota.value,
                RelatorioNota: Relatorionota.value,
                OrcamentoNota: Orcamento.value,
                PagamentoNota: Fpagamento.value,
                StatusNota: notaStatus.value
            }

            api.updateNota(Nota)


        }

    }

})


function findOS() {
    api.searchNota()
}

api.renderNota((event, dataNota) => {
    console.log(dataNota)
    const nota = JSON.parse(dataNota)
    idOS.value = nota._id

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
    placNota.value = nota.PlacaNota
    nameClient.value = nota.NomeNota
    idClient.value = nota.IdCliente
    Dentradanota.value = nota.DataEntradaNota
    Dsaidanota.value = nota.DataSaidaNota
    Relatorionota.value = nota.RelatorioNota
    Orcamento.value = nota.OrcamentoNota
    Fpagamento.value = nota.PagamentoNota
    notaStatus.value = nota.StatusNota
    bntCrate.disabled = true
    btnUpdate.disabled = false
    btnDelete.disabled = false

})


function removeOS() {
    console.log(idOS.value)
    api.deleteOS(idOS.value)
}


function resetForm() {


    location.reload()
}


api.resetForm((args) => {
    resetForm()
})




const input = document.getElementById('searchNameNota')

const suggestionList = document.getElementById('viewListSuggestion')

let nameClient = document.getElementById('inputNameNota')
let IdCliente = document.getElementById('iputidClient')


let arrayCients = []


input.addEventListener('input', () => {
    const search = input.value.toLowerCase()

    api.searchClients()

    api.listClients((event, clients) => {
        const dataClients = JSON.parse(clients)

        arrayCients = dataClients

        const results = arrayCients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 10)
        suggestionList.innerHTML = ""

        results.forEach(c => {

            const item = document.createElement('li')

            item.classList.add('list-group-item', 'list-group-item-action')

            item.textContent = c.nomeCliente


            suggestionList.appendChild(item)



            item.addEventListener('click', () => {
                nameClient.value = c.nomeCliente
                IdCliente.value = c._id

                input.value = ""
                suggestionList.innerHTML = ""

            })
        })

    })
})


document.addEventListener('click', (event) => {
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})







function gerateOS() {
    api.printOS()
}

















