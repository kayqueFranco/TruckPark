//Buscar CEP 
function buscarCEP(){
    let cep= document.getElementById('inputCEPClient').value
    console.log(cep)
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    // Acessando o web service para obter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            //extração dos dados 
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputNeighorhoodClient').value = dados.bairro
            document.getElementById('inputcityClient').value = dados.localidade
            document.getElementById('uf').value = dados.uf

        })
        .catch(error => console.log(error))
}
//  Capturar o foco na busca pelo nome do cliente 
// a constante foco obtem o elemento html(input)indentificado como 'searchClient'
const foco = document.getElementById('searchCliet')

// iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded',()=>{
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // foco na busca do cliente 
    foco.focus()
})

// captura dos dados dos input do formulario (passo1 :Fluxo)
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

// teste importante
// ===========================================================================
//  ======================== CRUD Create/Update================================

//  Evento associado ao botão submit (uso das validações do html)
frmClient.addEventListener('submit',async(event)=>{
    //  evitar o comportamento padrão do submit que é enviar os dados do formulario 
    // e reniciar o documento html
    event.preventDefault()
    // teste importante (recebimento dos dados no formulário - passo 1 fluxo)
   

     console.log(nameClient.value,cpfClient.value,telefoneClient.value,cepClient.value,logradouroClient.value,numeroClient.value,complementClient.value,bairroClient.value,cidadeClient.value,ufClient.value)
    // Limpa o CPF antes de salvar no banco
    let cpfSemFormatacao = cpfClient.value.replace(/\D/g, "");
    //  criar um objeto para armazenar os dados do cliente antes de enviar ao main
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
    // enviar ao main o objeto client - passo 2 - fluxo
    // uso do preload.js
    api.newClient(client)
})



function resetForm(){
    // Limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}

// recebendo do pepido do main para resetar o form
api.resetForm((args)=>{
    resetForm()
})

// ===fim reset form ========================================================================


//======================== FIm do CRUD Create/Update===================================


// === Função para aplicar máscara no CPF ===
function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}

// === Função para validar CPF ===
function validarCPF() {
    let campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

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

// Adicionar eventos para CPF
cpfClient.addEventListener("input", () => aplicarMascaraCPF(cpfClient)); // Máscara ao digitar
cpfClient.addEventListener("blur", validarCPF); // Validação ao perder o foco