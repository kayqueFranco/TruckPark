// captura dos dados dos input do formulario (passo1 :Fluxo)
let frmCamiao = document.getElementById('frmCamiao')
let PlacaCaminhao = document.getElementById('inputPlacaCaminhao')
let ModeloCaminhao = document.getElementById('inputModelCainhao')
let MarcaCaminhao = document.getElementById('inputMarcaCainhao')
let AnoCaminhao = document.getElementById('inputyearCaminhao')
let DescricaoCaminhao = document.getElementById('inputDescripitionCaminhao')

frmCamiao.addEventListener('submit',async(event)=>{
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(PlacaCaminhao.value,ModeloCaminhao.value,MarcaCaminhao.value,AnoCaminhao.value,DescricaoCaminhao.value)


    const caminhao ={
        PlacCamin: PlacaCaminhao.value,
        ModelCamin:ModeloCaminhao.value,
        MarcaCamin:MarcaCaminhao.value,
        AnoCamin:AnoCaminhao.value,
        DescCamin:DescricaoCaminhao.value
    }


    api.newCaminhao(caminhao)
})

function resetForm(){
    // Limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}

// recebendo do pepido do main para resetar o form
api.resetForm((args)=>{
    resetForm()
})
