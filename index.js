const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", (req, res) => {
  return Object.keys(req.body).length ? JSON.stringify(req.body) : "";
});

const PORT = process.env.PORT || 3001;
const MAX_ID = 999999;
const baseUrl = "/api/persons";

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("build"));

app.get("/info", (req, res) => {
  const reqDate = new Date();
  const infoPage = `
  <h3>Phonebook has info for ${phonebook.length} people</h3>
  <p>${reqDate}</p>`;
  res.send(infoPage);
});

app.get(baseUrl, (req, res) => {
  res.json(phonebook);
});

app.get(`${baseUrl}/:id`, (req, res) => {
  const id = +req.params.id;
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    return res.json(person);
  }
  return res
    .status(404)
    .send(`<h1>Person with id ${id} does not exist</h1>`)
    .end();
});

app.post(baseUrl, (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Must provide name and number",
    });
  }
  const duplicatePerson = phonebook.find((person) => person.name === body.name);
  if (duplicatePerson) {
    return res.status(400).json({
      error: "Person already exists",
    });
  }
  const newId = generateId();
  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number,
  };
  phonebook.push(newPerson);
  res.json(newPerson);
});

app.delete(`${baseUrl}/:id`, (req, res) => {
  const id = +req.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const generateId = () => {
  return Math.floor(Math.random() * MAX_ID);
};
