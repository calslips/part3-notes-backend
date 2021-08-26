const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongos.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://csp-fso21:${password}@cluster0.tgyrb.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "Figure out why find() is not working",
  date: new Date(),
  important: true,
});

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

// Note.find({}).exec().then((result) => {
//   // console.log('Total Find result:', result);
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close()
// })
// // .then(
// //   mongoose.connection.close()
// // )
// .catch((err) => {
//   console.error(err);
// });

Note.find({})
  .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
  // .catch(err => console.log(err))

// Note.find({})
//   .exec((result) => {
//     console.log(result)
//     mongoose.connection.close()
//   })
  // .catch(err => console.log('### FIND ERROR:', err))

// const query = Note.find({ important: false })
// query.then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })
// console.log(query);
// mongoose.connection.close()

// .then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

// Note.find({}, function (err, docs) {
//   if (err) {
//     return console.log('### FIND ERROR', err)
//   }
//   console.log(docs)
//   mongoose.connection.close()
// })
// .then(mongoose.connection.close());
