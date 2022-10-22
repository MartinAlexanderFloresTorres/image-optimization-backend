import sharp from "sharp";
import generarId from "../helpers/generarId.js";
import fs from "fs";

// Obtener imagenes
const getImages = async (req, res) => {
  const quality = Number(req.query.quality) || 10;
  const width = Number(req.query.width) || 0;
  const height = Number(req.query.height) || 0;
  const resize = req.query.resize || "cover";
  const formato = req.query.mimeType || "webp";

  try {
    // Array de imagenes
    const uploads = [];

    // Si hay archivos
    if (!req?.files?.file) {
      return res
        .status(400)
        .json({ msg: "No se han enviado archivos para subir." });
    }

    // Desestructurar archivos
    const { file } = req.files;

    // Si es un array de archivos 0 (Multiples archivos)
    const files = file?.length ? file : [file];

    // Recorrer los archivos
    await files.map(async (file) => {
      const { name, data } = file;

      // Validar que sean formato imagen
      const formatos = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
      ];
      if (!formatos.includes(file.mimetype)) {
        return res
          .status(400)
          .json({ msg: "Solo se permiten jpeg, jpg, png, webp, svg." });
      }

      // Generar nombre unico
      const id = generarId();
      const fileName = `${id}-${name.split(".")[0]}`;

      // calcular el ancho y alto
      const { width: w, height: h } = await sharp(data).metadata();

      // Generar un buffer con sharp para optimizar la imagen
      const buffer = await sharp(data)
        .resize(width || w, height || h, {
          fit: resize,
          position: "center",
          height: height || h,
          width: width || w,
        })
        .toFormat(formato, { quality })
        .toBuffer();

      // Crear el directorio
      const dir = `./uploads`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      // Escribir la imagen en el directorio
      fs.writeFile(`${dir}/${fileName}.${formato}`, buffer, (err) => {
        if (err) {
          console.log(err);
        }

        // Eliminar la imagen original
        setTimeout(() => {
          fs.unlink(`${dir}/${fileName}.${formato}`, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }, 2000);
      });

      // Agregar la imagen al array
      uploads.push({
        id,
        fileName: fileName + "." + formato,
        url: `${
          process.env.FRONTEND_URL || "http://localhost:4000"
        }/uploads/${fileName}.${formato}`,
      });

      // Enviar la respuesta
      if (uploads.length === files.length) {
        return res.json(uploads);
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

// Exportar
export { getImages };
