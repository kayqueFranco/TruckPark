/**
 * Modrlo de dados para construção de coleções("Tabelas")
 * Clientes
 */

// inportação de recursos do framework mongoose
const {model , Schema} = require('mongoose')


const caminhaoSchema = new Schema ({
    PlacaCaminhao: {type:String},
    ModeloCaminhao: {type:String},
    MarcaCaminhao:{type:String},
    AnoCaminhao: {type:String},
    DescricaoCaminhao:{type:String}
},{versionKey:false})// não versionar os dados armazenar 

// exporta pala o main o modelo de dados
// obs: Clientes será o nome da coleção 
module.exports = model('Caminhao' , caminhaoSchema)