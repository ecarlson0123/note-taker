const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/db');

function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.diet) {
      filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(note => note.text === query.text);
    }
    return filteredResults;
};

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};

app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post('/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();
  
    if (!validateNote(req.body)) {
      res.status(400).send('The note is not properly formatted.');
    } else {
      const note = createNewNote(req.body, notes);
      res.json(note);
    }
});
  

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});