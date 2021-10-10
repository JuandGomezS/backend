const {pathname: root} = new URL('../', import.meta.url)
const __dirname=root.substring(1);

let dataPath= __dirname + "/db/mensajes.sqlite";

export const optionsSQLite = {
    client: 'sqlite3',
    connection: {
        filename: dataPath
    },
    useNullAsDefault: true
}

console.log('Conectando a la base de datos SQLite...');

