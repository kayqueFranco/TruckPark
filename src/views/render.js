/**
 * Processo de renderização
 */

console.log("Processor de renderização")
function cliente(){
    // console.log("teste do botão cliente")
     //uso da api(autorizada no perolad.js)
     api.clientWindow()
 }
 
 
 
 
 function nota(){
     api.notaWindow()
 }


// troca do icone do banco de dados (usando a api do preload.js)
api.dbStatus((event, message) => {
    // teste do recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
}
)