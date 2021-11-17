import mongoose from 'mongoose';

const usuariosCollection = 'usuarios';

const usuarioEsquema = mongoose.Schema(
    {
      username: { type: String, required: true },
      password: { type: String, required: true },
    },
    { versionKey: false }
);

const usuario = mongoose.model(usuariosCollection, usuarioEsquema);


const insertUser= async({username,password})=>{
    let user=new usuario({username,password})
    user.save(function (err, book) {
        if (err) return console.error(err);
        console.log(" Usuario guardado.");
    });
}

const getUser= async()=>{
    const user = await usuario.find({id:id},{_id: 0, __v: 0});
    return user
}

function passwordOk(password, user) {
    return bcrypt.compareSync(password, user.password);
}
  
function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}