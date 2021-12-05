import mongoose from 'mongoose';

let usuarioC='';

const usuariosCollection = 'usuarios';

const usuarioEsquema = mongoose.Schema(
    {
        facebookId: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        picture: { type: String, required: true },
      },
    { versionKey: false }
);

const usuario = mongoose.model(usuariosCollection, usuarioEsquema);


const getUser= async(user)=>{
    
    try {
        let usua = await usuario.find({facebookID:user},{_id: 0, __v: 0});
        
        return usua
        
    } catch (error) {
        return null
    }
}



async function verifyUser(accessToken, refreshToken, profile, done) {
    try {
      const [user] = await getUser(profile.id);
      if (user) return done(null, user);
      else {
        let nuevoUsuario = new usuario({
          facebookId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
          picture: profile.photos[0].value,
        });
        nuevoUsuario.save(function (err, book) {
          if (err) return console.error(err);
          console.log(" Usuario agregado.");
        });
        return done(null, nuevoUsuario);
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
    let username;
    usua.length==undefined?username = usua.username:username = usua[0].username;
    try {
        const user = await usuario.find({ username: username })
        return user ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error);
    }
}




export {serializeUser, deserializeUser, verifyUser, usuarioC}