import mongoose from "mongoose";

const connectDB = async () => {
  const URI = "mongodb+srv://juanGomez:Juan.1604*@cluster0.dwkqc.mongodb.net/ecommerce?retryWrites=true&w=majority";
  await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Conectado a la base de datos de Mongo...");
};

export{connectDB}
