import express from "express";
import router from "./routers/uploadsRouter.js";
import { corsOptions } from "./config/configCors.js";
import cors from "cors";
import path from "path";

// Inicializar express
const app = express();
// Habilitar los CORS
app.use(cors(corsOptions));

// Habilitar form data
app.use(express.urlencoded({ extended: true }));

// Formatos json
app.use(express.json());

// Defifinir el puerto
const PORT = process.env.PORT || 4000;

// Permite utilizar diferentes verbos HTTP
app.use("/api/uploads", router);

// Definir la carpeta publica
app.use(express.static("uploads"));

// Configurar __dirname
const __dirname = path.resolve();

// Mostrar las imagenes
app.get("/uploads/:image", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, `/uploads/${req.params.image}`));
  } catch (error) {
    console.log(error.message);
  }
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
