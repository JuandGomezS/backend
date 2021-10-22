import mongoose from "mongoose";

const connectDB = async () => {
  const URI = "mongodb://localhost:27017/ecommerce";
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 1000,
  });
  console.log("Conectado a la base de datos de Mongo...");
};

export{connectDB}
