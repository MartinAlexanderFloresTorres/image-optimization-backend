const whiteList = [process.env.FRONTEND_URL, process.env.BACKEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    const existe = whiteList.some((dominio) => dominio === origin);
    if (existe) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },

  // origin: whiteList
};

export { corsOptions };
