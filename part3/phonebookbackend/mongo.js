const mongoose = require("mongoose");

if (process.argv.length === 4) {
  console.log("password is missing");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://candylia:${password}@notes.jwzpylh.mongodb.net/?retryWrites=true&w=majority&appName=notes`;
mongoose.set("strictQuery", false);
mongoose.connect(url, {});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const newName = process.argv[3];
const newNumber = process.argv[4];

if (!newName || !newNumber) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: newName,
    number: newNumber,
  });
  person.save().then((result) => {
    console.log("new entry added!");
    mongoose.connection.close();
  });
}
