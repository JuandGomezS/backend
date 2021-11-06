import mongoose from 'mongoose';
import {normalize, schema} from 'normalizr';

const mensajesCollection = 'mensajes';

const mensajeEsquema = mongoose.Schema({
    autor: {type: String, require: true, minLength: 1, maxLenghth: 500},
    date: {type: String, require: true, minLength: 1, maxLenghth: 50},
    texto: {type: String, require: true, minLength: 1, maxLenghth: 1000},
});

const mensaje = mongoose.model(mensajesCollection, mensajeEsquema);

const getMessages = async()=>{
    let mensajes= await mensaje.find({}, {_id: 0, __v: 0});
    const array =  {mensajes}
    const autorSchema = new schema.Entity('autor');
    const mensajesSchema = new schema.Entity('mensajes',{
        autor: autorSchema,
        date: 
    })
    return mensajes
}

const insertMessage = async (data)=>{
    try {  
        let mensaj=new mensaje(data)
        mensaj.save(function (err, book) {
            if (err) return console.error(err);
            console.log(" Mensaje guardado.");
        });
    } catch (error) {
        throw `Error: ${error}`;
    }
}

export {getMessages, insertMessage}




