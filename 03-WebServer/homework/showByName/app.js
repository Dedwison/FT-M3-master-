var fs = require("fs");
var http = require("http");

// Escribí acá tu servidor

http
  .createServer(function (req, res) {
    console.log(req.url);
    if (req.url === "/") {
      res.writeHead(201, { "Content-Type": "Aplication/json" });

      const obj = {
        msj: "Intenta buscar los siguientes nombres de Doges",
        names: ["code", "badboy", "retrato", "resaca", "sexy", "arcoiris"],
      };

      res.end(JSON.stringify(obj));
    } else {
      fs.readFile(`./images${req.url}_doge.jpg`, (err, LecturaImg) => {
        if (err) {
          res.writeHead(404);
          res.end(`Imagen ${req.url} no encontrada`);
        } else {
          res.writeHead(200);
          res.end(LecturaImg);
        }
      });
    }
  })
  .listen(3000, () => {
    console.log("running on PORT 3000");
  });
