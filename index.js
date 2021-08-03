const express = require("express");
const app = express();

const PORT = 3001;
const MAX_ID = 999999;

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

app.use(express.json());

app.get("/info", (req, res) => {
  const reqDate = new Date();
  const infoPage = `
  <h3>Phonebook has info for ${phonebook.length} people</h3>
  <p>${reqDate}</p>`;
  res.send(infoPage);
});

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {
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

app.post("/api/persons", (req, res) => {
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

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const generateId = () => {
  return Math.floor(Math.random() * MAX_ID);
};
