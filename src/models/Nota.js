/**
 * Modrlo de dados para construção de coleções("Tabelas")
 * Clientes
 */

// inportação de recursos do framework mongoose
const { model, Schema } = require('mongoose')

const notaSchema = new Schema({
   NumNota:{type:String},
   NomeNota: { type: String },
   cpfNota:{type:String},
   PlacaNota:{type:String}, 
   DataEntradaNota:{type:String},
   DataSaidaNota:{type:String},
   RelatorioNota: { type: String },
   OrcamentoNota: { type: String },
   PagamentoNota: { type: String },
   StatusNota: { type: String }
}, { versionKey: false }) // não versionar os dados armazenados 
module.exports = model('Notas', notaSchema)