// captura dos dados dos input do formulario (passo1 :Fluxo)
let  frmNota = document.getElementById('frmNota')
let  nNota = document.getElementById('inputNnota')
let  Dentradanota= document.getElementById('inputDentradanota')
let Dsaidanota = document.getElementById('inputDsaidanota')
let Relatorionota = document.getElementById('inputRelatorionota')
let Orcamento = document.getElementById('inputOrcamento')
let Fpagamento = document.getElementById('inputFpagamento')
let notaStatus = document.getElementById('notaStatus')






frmNota.addEventListener('submit',async(event)=>{
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(nNota.value,Dentradanota.value,Dsaidanota.value,Relatorionota.value,Orcamento.value,Fpagamento.value,notaStatus.value)

    // Criar um objeto para armazenar os dados do cliente amtes de enviar ao main
    const Nota = {
        RelaNota:Relatorionota.value,
        orcaNota:Orcamento.value,
        formNota:Fpagamento.value,
        statusNota:notaStatus.value


    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // uso do preload.js
    api.newNota(Nota) 
}) 
