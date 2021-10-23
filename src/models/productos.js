import mongoose from 'mongoose';

const productosCollection = 'productos';

const productoEsquema = mongoose.Schema({
    id:{type: Number, require: true},
    title: {type: String, require: true, minLength: 1, maxLenghth: 50},
    price: {type: Number, require: true},
    thumbnail: {type: String, require: true, minLength: 1, maxLenghth: 1000},
});

const producto = mongoose.model(productosCollection, productoEsquema);

const getProducts= async ()=>{
  return await producto.find({}, {_id: 0, __v: 0})
}

const getProduct= async (id)=>{
    return await producto.find({id:id},{_id: 0, __v: 0})
}

const updateProduct= async (prod,id)=>{
    try {
        console.log(prod)
        await producto.updateOne({id:id}, {prod});
        return true
    } catch (error) {
        return false
    }
}

const deleteProduct= async (id)=>{
    try {
        await knex('productos')
        .where('id', id)
        .del()
        return true
    } catch (error) {
        return false
    }
}

const insertProduct=async (producto)=>{
    try {
        await knex('productos').insert({
            title: producto.title,
            price: producto.price,
            thumbnail: producto.thumbnail
        })
        return true
    } catch (error) {
        return false
    }
}


export {getProduct, getProducts, deleteProduct, updateProduct, insertProduct, createTable}