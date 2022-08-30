// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

let nextId = 1;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests
/* server.get("/", (req, res) => {
  //   const bodyName = req.body.name;
  let obj = {
    msj: `Hola, bienvenido`,
  };
  res.status(200).send(obj);
});

server.get("/search", (req, res) => {
  const name = req.query.name;

  let obj = {
    msj: `Hola ${name}, bienvenido`,
  };
  res.status(200).send(obj);
}); */

server.post("/posts", (req, res) => {
  const { author, title, contents } = req.body;

  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }

  let newPost = {
    id: nextId,
    author,
    title,
    contents,
  };

  posts.push(newPost);
  nextId++;
  res.json(newPost);
});

server.post("/posts/author/:author", (req, res) => {
  const { title, contents } = req.body;
  const { author } = req.params;

  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }

  let newPost = {
    id: nextId,
    author,
    title,
    contents,
  };

  posts.push(newPost);
  nextId++;
  res.json(newPost);
});

server.get("/posts", (req, res) => {
  const { term } = req.query;
  if (term) {
    const encontrados = posts.filter(
      (p) => p.title.includes(term) || p.contents.includes(term)
    );
    return res.json(encontrados);
  }
  res.json(posts);
});

server.get("/posts/:author", (req, res) => {
  const { author } = req.params;
  const encontrados = posts.filter((p) => p.author === author);
  if (!encontrados.length) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  }
  res.json(encontrados);
});

server.get("/posts/:author/:title", (req, res) => {
  const { author, title } = req.params;
  const encontrados = posts.filter(
    (p) => p.author === author && p.title === title
  );
  if (!encontrados.length) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  }
  res.json(encontrados);
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;

  if (!id || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
  const searchId = posts.find((p) => p.id === id);
  if (!searchId)
    return res.status(STATUS_USER_ERROR).json({
      error: "No se encontro ningun post con el id solicitado",
    });
  searchId.title = title;
  searchId.contents = contents;
  res.json(searchId);
});

server.delete("/posts", (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibio ningun id como paramatro",
    });
  const searchId = posts.find((p) => p.id === id);
  if (!searchId)
    return res.status(STATUS_USER_ERROR).json({
      error: "No se encontro ningun post con el id solicitado",
    });

  posts = posts.filter((p) => p.id !== id);
  res.json({ success: true });
});

server.delete("/author", (req, res) => {
  const { author } = req.body;
  if (!author)
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibio ningun author como paramatro",
    });
  const searchAuthor = posts.filter((p) => p.author === author);
  if (!searchAuthor.length)
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe el autor indicado",
    });

  posts = posts.filter((p) => p.author !== author);
  res.json(searchAuthor);
});

module.exports = { posts, server };
