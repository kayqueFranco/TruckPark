
console.log("Processor de renderização")
function cliente() {


    api.clientWindow()
}




function nota() {
    api.notaWindow()
}



api.dbStatus((event, message) => {

    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
}
)