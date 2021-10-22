import {options} from "../options/MariaDB.js";
import Knex from 'knex';

const knex = Knex(options);

const createTable = ()=>{
    knex.schema.hasTable('productos').then(async function(exists) {
        if (!exists) {
            try {
              await knex.schema.createTable('productos', table => {
                table.increments('id'),
                table.string('title'),
                table.integer('price');
                table.string('thumbnail');
              });
              console.log('tabla creada!');
              knex.destroy();
            } 
            catch (e) {
              console.log('Error en create de tabla:', e);
              knex.destroy();
            }
          }
        }
    );
};

const getProducts= async ()=>{
  return await knex.select('*').from('productos')
}

const getProduct= async (id)=>{
    return await knex.select('*').from('productos').where("id", id)
}

const updateProduct= async (producto,id)=>{
    try {
        await knex('productos')
        .where('id', id)
        .update(producto)
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