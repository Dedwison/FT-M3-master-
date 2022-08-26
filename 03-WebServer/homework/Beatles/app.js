var http = require("http");
const { home, api, artista, perfil, beatles } = require("./controlador");

const rutas = {
  "/": home,
  "/api": api,
  "/api/": api,
};
http
  .createServer(function (req, res) {
    if (rutas[req.url]) {
      rutas[req.url](req, res);
    } else {
      if (req.url.substring(0, 5) === "/api/") {
        artista(req, res);
      } else {
        if (req.url.includes("20")) {
          perfil(req, res);
        } else {
          res.writeHead(404);
          res.end("No encontramos la ruta solicitada");
        }
      }
    }
  })
  .listen(3001, () => {
    console.log(`Running on PORT: 3000}`);
  });
