const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Note = require('../models/note');
const User = require('../models/user');

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);

  // *** for...of to execute promises in specific order
  // for (let note of helper.initialNotes) {
  //   let noteObject = new Note(note);
  //   await noteObject.save();
  // }

  // *** Promise.all executes promises in parallel
  // const noteObjects = helper.initialNotes.map((note) => new Note(note));
  // const promiseArray = noteObjects.map((note) => {
  //   note.save();
  // });
  // await Promise.all(promiseArray);

  // let noteObject = new Note(helper.initialNotes[0]);
  // await noteObject.save();
  // noteObject = new Note(helper.initialNotes[1]);
  // await noteObject.save();
});

describe('when notes are initially saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map(r => r.content);
    expect(contents).toContain('Browser can execute only Javascript');
  });
});

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test('fails with status code 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();
    console.log(validNonexistingId);

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '43mio43om43io234ih6652b';

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400);
  });
});

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(n => n.content);
    expect(contents).toContain('async/await simplifies making async calls');
  });

  test('fails with status code 400 if data is invalid', async () => {
    const newNote = {
      important: true
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe('deletion of a note', () => {
  test('succeeds with status code 204 with valid id', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map(n => n.content);
    expect(contents).not.toContain(noteToDelete.content);
  });

  test('fails with status code 400 with invalid id', async () => {
    const invalidId = '43mio43om43io234ih6652b';

    await api
      .delete(`/api/notes/${invalidId}`)
      .expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'whybe',
      name: 'Yarl Borg',
      password: 'futile'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salami'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
