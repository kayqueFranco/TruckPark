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