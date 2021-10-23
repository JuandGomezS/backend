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

const getProductsH= async ()=>{
    return await producto.find({}, {_id: 0, __v: 0}).lean()
  }

const getProduct= async (id)=>{
    return await producto.find({id:id},{_id: 0, __v: 0})
}

const updateProduct= async (prod,id)=>{
    try {
        await producto.updateOne({id:id}, prod);
        return true
    } catch (error) {
        return false
    }
}

const deleteProduct= async (id)=>{
    try {
        let del= await producto.deleteOne({id:id})
        return del.deletedCount>0
    } catch (error) {
        return false
    }
}

const insertProduct=async ({title,price,thumbnail})=>{
    try {


        let last= await producto.find({}).sort({id: -1}).limit(1);
        console.log(last)
        let newId=last.length==0?1:last.shift().id+1;
        console.log(`ID: ${newId}`)
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


export {getProduct, getProducts, deleteProduct, updateProduct, insertProduct, getProductsH}