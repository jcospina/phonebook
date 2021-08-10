const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide all required arguments: node mongo.js <password:required> <name:optional> <phone:optional>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = +process.argv[4];

const url = `mongodb+srv://juan_fullstack:${password}@fullstack-course.6ymct.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });
  person.save().then((result) => {
    console.log(`
      added ${name} with number ${number} to phonebook
      `);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((persons) => {
    console.log("Phonebook:");
    persons.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
}
