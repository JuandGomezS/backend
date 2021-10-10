import {optionsSQLite} from "../options/sqlite.js";
import Knex from 'knex';

const knex = Knex(optionsSQLite);

const createTable = ()=>{
    try {

        knex.schema.hasTable('mensajes').then(async function(exists) {
            if (!exists) {
                try {
                  await knex.schema.createTable('mensajes', table => {
                    table.increments('id'),
                    table.string('autor'),
                    table.string('date');
                    table.string('texto');
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
        
    } catch (error) {
        console.log('Error base de datos:', error);
    }
    
};

const insertMessage=async (mensaje)=>{
    try {
        await knex('mensajes').insert({
            autor: mensaje.autor,
            date: mensaje.date,
            texto: mensaje.texto
        })
        return true
    } catch (error) {
        return false
    }
};

const getMessages=async ()=>{
    try {
        return await knex.select('*').from('mensajes')
    } catch (error) {
        return []
    }
};

export {createTable, insertMessage, getMessages}