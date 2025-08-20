const mongoose = require("mongoose");

if (process.argv.length < 3 && process.argv.length > 1) {
  console.log("password is missing");
  process.exit(1);
}

if (process.argv.length === 1) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

const password = encodeURIComponent(process.argv[0]);

const url = `mongodb+srv://candylia:${password}@notes.jwzpylh.mongodb.net/?retryWrites=true&w=majority&appName=notes`;

mongoose.set("strictQuery", false);

mongoose.connect(url, {
  authMechanism: "SCRAM-SHA-256",
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const newname = process.argv[1];
const newnumber = process.argv[2];

const person = new Person({
  name: newname,
  number: newnumber,
});

person.save().then((result) => {
  console.log("new entry added!");
  mongoose.connection.close();
});
