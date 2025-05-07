let arrayCaminhao = []

// capturar o fogo de busca pelo nome do caminhão 
// a contante foco obtem o elemento html(input)identifado com
// 'searchTruck'
const foc = document.getElementById('SearchTruck')


// iniciar a janela de caminhão alterado as propria de alguns elementos
document.addEventListener('DOMContentLoaded',() =>{
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // foco na busca do caminhão
    foco.focus()
})





// captura dos dados dos input do formulario (passo1 :Fluxo)
let frmCamiao = document.getElementById('frmCamiao')
let PlacaCaminhao = document.getElementById('inputPlacaCaminhao')
let ModeloCaminhao = document.getElementById('inputModelCainhao')
let MarcaCaminhao = document.getElementById('inputMarcaCainhao')
let AnoCaminhao = document.getElementById('inputyearCaminhao')
let DescricaoCaminhao = document.getElementById('inputDescripitionCaminhao')
// capturar id dos caminhão (usado no delet update)
let id = document.getElementById("idTruck")

// teste importante===========================================

// manipulção da tecla Enter=============================

// função para manipular o evento da tecla Enter
function teclaEnter(event){
    if (event.key === "Enter"){
        event.preventDefault() //ignorar o comportamento padrão 
        // associar o Enter a busca do caminhão
        buscarCaminhao()
    }
}

function restaurarEnter(){
    frmCamiao.removeEventListener('keydown',teclaEnter)
}

// escutr do evento tecla Enter
frmCamiao.addEventListener('keydown',teclaEnter)


// FIm da manipulação da tecla Enter========================

frmCamiao.addEventListener('submit',async(event)=>{
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(PlacaCaminhao.value,ModeloCaminhao.value,MarcaCaminhao.value,AnoCaminhao.value,DescricaoCaminhao.value,id.value)
    if(id.value ===""){
        const caminhao ={
            PlacCamin: PlacaCaminhao.value,
            ModelCamin:ModeloCaminhao.value,
            MarcaCamin:MarcaCaminhao.value,
            AnoCamin:AnoCaminhao.value,
            DescCamin:DescricaoCaminhao.value
        }
    
    
        api.newCaminhao(caminhao)
    }else{
        const caminhao = {
            idcamin : id.value,
            PlacCamin: PlacaCaminhao.value,
            ModelCamin:ModeloCaminhao.value,
            MarcaCamin:MarcaCaminhao.value,
            AnoCamin:AnoCaminhao.value,
            DescCamin:DescricaoCaminhao.value
        }

        api.updateCaminhao(caminhao)
    }

   
})

function resetForm(){
    // Limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}

// recebendo do pepido do main para resetar o form
api.resetForm((args)=>{
    resetForm()
})



// ===================Crud Read =========================
function buscarCaminhao(){
    // console.log("Teste botão buscae")
    // Passo 1: capturar o nome do caminhao
    let caminhao = document.getElementById('SearchTruck').value
    console.log(caminhao)// teste do passo 1

    // validaçãop do campo onrigatório
    // se o campo de busca não for prenchido
    if(caminhao ===""){
        
    }
}




// =============================FIM CRUd REad=====================

function buscarCaminhao(){
    let camin = document.getElementById('SearchTruck').value
    console.log(camin)


    if(camin ===""){
        api.validateSearch()
        foco.focus()
    }else{
        
    }
}