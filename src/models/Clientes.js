

const { model, Schema } = require('mongoose')


const clientesSchema = new Schema({
    nomeCliente: { type: String },
    cpfCliente: { type: String, unique: true, index: true },
    emailCliente: { type: String },
    foneCliente: { type: String },
    cepCLiente: { type: String },
    logradouroCliente: { type: String },
    numeroCliente: { type: String },
    complementoCliente: { type: String },
    bairroCLiente: { type: String },
    cidadeCliente: { type: String },
    ufCliente: { type: String }

}, { versionKey: false })



module.exports = model('Clientes', clientesSchema)