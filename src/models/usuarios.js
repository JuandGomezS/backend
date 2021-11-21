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
    let usua = await usuario.find({username:user},{_id: 0, __v: 0});
    return usua
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
        usuarioC=usua[0].username;
        if (usua == undefined) {
            return done(null, false, console.log(username, 'usuario no existe'));
        } else {
            if (passwordOk(password,usua[0])){
                return done(null, usua)  
            } else {
                return done(null, false, console.log(username, 'password errónea'));
            }
        }
        
    } catch (error) {
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
  
async function deserializeUser(username, done) {
    try {
        const user = await getUser(username)
        return user ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error);
    }
}


export {loginUser, signupUser, serializeUser, deserializeUser, usuarioC}