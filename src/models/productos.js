import mongoose from 'mongoose';

const productosCollection = 'productos';

const productoEsquema = mongoose.Schema({
    id:{type: Number, require: true},
    title: {type: String, require: true, minLength: 1, maxLenghth: 50},
    price: {type: Number, require: true},
    thumbnail: {type: String, require: true, minLength: 1, maxLenghth: 1000},
});

const producto = mongoose.model(productosCollection, productoEsquema);



const insertProduct=async ({title,price,thumbnail})=>{
    try {
        let last= await producto.find({}).sort({id: -1}).limit(1);
        let newId=last.length==0?1:last.shift().id+1;
        let prod=new producto({id:newId, title, price, thumbnail})
        prod.save(function (err, book) {
            if (err) return console.error(err);
            console.log(" Producto guardado.");
        });
        return true
    } catch (error) {
        return false
    }
}


export { insertProduct, producto}