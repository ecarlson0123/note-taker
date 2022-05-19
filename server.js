const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/db');
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ notes: notesArray }, null, 2)
    );
    console.log(note);
    return note;
};

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

app.delete('/api/notes/:id', (req, res) => {
    let noteToDelete = notes.findIndex((value)=> {
        return value.id === req.params.id
    });
    notes.splice(noteToDelete, 1)
    res.json('note removed');
    res.status = 200
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

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

app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    highestIndex = 0
    for(const note in notes){
        console.log(note);
        if(notes[note].id>highestIndex){
            newIndex = (Number(notes[note].id)+1);
            console.log(newIndex)
            highestIndex = newIndex;
        }
        else {
            highestIndex +=1
        }
    }
    req.body.id = highestIndex.toString();
    const note = createNewNote(req.body, notes);
    res.json(note);

});
  

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});