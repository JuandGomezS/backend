import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

let usuarioC='';

const usuariosCollection = 'usuarios';

const usuarioEsquema = mongoose.Schema(
    {
      username: { type: String, required: true },
      password: { type: String, required: true },
    },
    { versionKey: false },
    
);

const usuario = mongoose.model(usuariosCollection, usuarioEsquema);


const getUser= async(user)=>{
    
    try {
        let usua = await usuario.find({username:user},{_id: 0, __v: 0});
        
        return usua
        
    } catch (error) {
        return null
    }
}

function passwordOk(password, user) {
    return bcrypt.compareSync(password, user.password);
}
  
function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

async function loginUser(req, username, password, done) {
    try {
        let usua = await getUser(username)
        if (usua.length==0) {
            return done(null, false, {mensaje: 'Usuario o contraseña incorrectos'});
        } else {
            if (passwordOk(password,usua[0])){
                return done(null, usua)  
            } else {
                return done(null, false, {mensaje: 'Usuario o contraseña incorrectos'});
            }
        }
        
    } catch (error) {

        console.log(error)
        return done(error);
    }
}


async function signupUser(username, password, done) {
    
    try {
        let usua = await getUser(username);
        console.log(usua.length)
        if (usua.length>=1){
            return done(null, false, console.log(usua.username, 'Usuario ya existe'));
        } else {
            let nuevoUsuario = new usuario({
                username,
                password: createHash(password)
            })
            nuevoUsuario.save(function (err, book) {
                if (err) return console.error(err);
                console.log(" Usuario agregado.");
            });
            return done(null, nuevoUsuario)
        }
        
    } catch (error) {
        return done(error);
    }
}

function serializeUser(username, done) {
    try {
      return done(null, username);
    } catch (error) {
      return done(error);
    }
}
  
async function deserializeUser(usua, done) {
    console.log(usua)
    let username = usua[0].username
    try {
        const user = await usuario.find({ username: username })
        return user ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error);
    }
}




export {loginUser, signupUser, serializeUser, deserializeUser, usuarioC}