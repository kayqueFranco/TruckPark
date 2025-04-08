// captura dos dados dos input do formulario (passo1 :Fluxo)
let frmCamiao = document.getElementById('frmCamiao')
let PlacaCaminhao = document.getElementById('inputPlacaCaminhao')
let ModeloCaminhao = document.getElementById('inputModelCainhao')
let AnoCaminhao = document.getElementById('inputyearCaminhao')
let DescricaoCaminhao = document.getElementById('inputDescripitionCaminhao')

frmCamiao.addEventListener('submit',async(event)=>{
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(PlacaCaminhao.value,ModeloCaminhao.value,AnoCaminhao.value,DescricaoCaminhao.value)


    const Caminhao ={
        PlacCamin: PlacaCaminhao.value,
        ModelCamin:ModeloCaminhao.value,
        AnoCamin:AnoCaminhao.value,
        DescCamin:DescricaoCaminhao.value
    }


    api.NewCaminhao(Caminhao)
})