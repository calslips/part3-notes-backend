require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");

const app = express();
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---");
  next();
};

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(requestLogger);

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // const note = notes.find((note) => note.id === id);
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
    // .catch((error) => next(error));
  // note ? response.json(note) : response.status(404).end();
});

app.delete("/api/notes/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // notes = notes.filter((note) => note.id !== id);
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
    // .catch((error) => next(error));

  // response.status(204).end();
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  // const note = {
  //   id: generateId(),
  //   content: body.content,
  //   date: new Date(),
  //   important: body.important || false,
  // };
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  // notes = notes.concat(note);
  note.save().then((savedNote) => {
    response.status(201).json(savedNote);
  })
  .catch(next);

  // response.status(201).json(notes);
});

app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      // Note.findById(request.params.id)
      //   .then((existingNote) => {
      //     console.log('NOTE EXISTS RETURN', existingNote);
      //     if (!existingNote) {
      //       return response.status(404).end();
      //     }
      //     response.json(updatedNote);
      //   });
      response.json(updatedNote);
    })
    .catch(next);
    // .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
