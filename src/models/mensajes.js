import mongoose from 'mongoose';

const mensajesCollection = 'mensajes';

const mensajeEsquema = mongoose.Schema({
    autor: {type: String, require: true, minLength: 1, maxLenghth: 50},
    date: {type: String, require: true, minLength: 1, maxLenghth: 50},
    texto: {type: String, require: true, minLength: 1, maxLenghth: 1000},
});

const mensaje = mongoose.model(mensajesCollection, mensajeEsquema);

const getMessages = async()=>{
    let mensajes= await mensaje.find({}, {_id: 0, __v: 0});
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




