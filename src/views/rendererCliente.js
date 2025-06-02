
function buscarCEP() {
    let cep = document.getElementById('inputCEPClient').value
    console.log(cep)
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`

    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {

            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputNeighorhoodClient').value = dados.bairro
            document.getElementById('inputcityClient').value = dados.localidade
            document.getElementById('uf').value = dados.uf

        })
        .catch(error => console.log(error))
}



let arrayClient = []





const foco = document.getElementById('searchClient')



document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true

    foco.focus()
})





let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let telefoneClient = document.getElementById('inputPhoneClient')
let cepClient = document.getElementById('inputCEPClient')
let logradouroClient = document.getElementById('inputAddressClient')
let numeroClient = document.getElementById('inputnumberClient')
let complementClient = document.getElementById('inputcomplementClient')
let bairroClient = document.getElementById('inputNeighorhoodClient')
let cidadeClient = document.getElementById('inputcityClient')
let ufClient = document.getElementById('uf')

let id = document.getElementById('idClient')









function teclaEnter(event) {

    if (event.key === "Enter") {
        event.preventDefault()

        buscarCliente()
    }
}


function restaurarEter() {
    frmClient.removeEventListener('keydown', teclaEnter)
}


frmClient.addEventListener('keydown', teclaEnter)







frmClient.addEventListener('submit', async (event) => {


    event.preventDefault()



    console.log(nameClient.value, cpfClient.value, telefoneClient.value, cepClient.value, logradouroClient.value, numeroClient.value, complementClient.value, bairroClient.value, cidadeClient.value, ufClient.value, id.value)


    let cpfSemFormatacao = cpfClient.value.replace(/\D/g, "");



    if (id.value === "") {



        const client = {
            nameCli: nameClient.value,
            cpfCli: cpfSemFormatacao,
            telCli: telefoneClient.value,
            cepCli: cepClient.value,
            lograCli: logradouroClient.value,
            numCli: numeroClient.value,
            compliCli: complementClient.value,
            bairroCli: bairroClient.value,
            cidadeCli: cidadeClient.value,
            ufCli: ufClient.value

        }


        api.newClient(client)
    } else {



        const client = {
            idCli: id.value,
            nameCli: nameClient.value,
            cpfCli: cpfSemFormatacao,
            telCli: telefoneClient.value,
            cepCli: cepClient.value,
            lograCli: logradouroClient.value,
            numCli: numeroClient.value,
            compliCli: complementClient.value,
            bairroCli: bairroClient.value,
            cidadeCli: cidadeClient.value,
            ufCli: ufClient.value

        }


        api.updateClient(client)
    }


})





function resetForm() {

    location.reload()
}


api.resetForm((args) => {
    resetForm()
})








function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, "");

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}


function validarCPF() {
    let campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}



function buscarCliente() {


    let name = document.getElementById('searchClient').value
    console.log(name)




    if (name === "") {

        api.validateSearch()
        foco.focus()
    } else {
        api.searchName(name)

        api.renderClient((event, dataClient) => {
            console.log(dataClient)






            const dadosCliente = JSON.parse(dataClient)

            arrayClient = dadosCliente

            arrayClient.forEach((c) => {
                id.value = c._id,
                    nameClient.value = c.nomeCliente,
                    cpfClient.value = c.cpfCliente,
                    telefoneClient.value = c.foneCliente,
                    cepClient.value = c.cepCLiente,
                    logradouroClient.value = c.logradouroCliente,
                    numeroClient.value = c.numeroCliente,
                    complementClient.value = c.complementoCliente,
                    bairroClient.value = c.bairroCLiente,
                    cidadeClient.value = c.cidadeCliente,
                    ufClient.value = c.ufCliente

                btnCreate.disabled = true

                btnUpdate.disabled = false
                btnDelete.disabled = false




            })
        })

    }

}

api.setClient((args) => {

    let campoBusca = document.getElementById('searchClient').value

    nameClient.focus()
    cpfClient.focus()

    foco.value = ""
    if (/^[A-Za-z\s]+$/.test(campoBusca)) {

        nameClient.value = campoBusca;
    } else {

        cpfClient.value = campoBusca;
    }
    restaurarEter()
})




cpfClient.addEventListener("input", () => aplicarMascaraCPF(cpfClient));
cpfClient.addEventListener("blur", validarCPF);






function excluirCliente() {
    console.log(id.value)
    api.deleteClient(id.value)
}

