/**
 * Modrlo de dados para construção de coleções("Tabelas")
 * Clientes
 */

// inportação de recursos do framework mongoose
const {model , Schema} = require('mongoose')


const caminhaoSchema = new Schema ({
    PlacaCaminhao: {type:String}
    
})