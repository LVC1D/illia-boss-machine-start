const express = require('express');
const ideasRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const {
    getAllFromDatabase, 
    getFromDatabaseById, 
    addToDatabase, 
    updateInstanceInDatabase,
    deleteFromDatabasebyId
} = require('./db');

ideasRouter.param('ideaId', (req, res, next) => {
    const idea = getFromDatabaseById('ideas', req.params.ideaId);
    if (!idea) {
        res.status(404).send('Minion not found!');
    } else {
        req.idea = idea;
        next();
    }
});

ideasRouter.get('/', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');
    res.send(ideas);
});

ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea);
});

ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = req.body;
    if (!newIdea) {
        res.status(400).send('Idea cannot be created!');
    } else {
        const addedIdea = addToDatabase('ideas', newIdea);
        res.status(201).send(addedIdea);
    }
});

ideasRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
    const ideaToUpdate = req.body;
    if (!ideaToUpdate) {
        res.status(404).send()
    } else {
        const updatedIdea = updateInstanceInDatabase('ideas', ideaToUpdate);
        res.send(updatedIdea);
    }
});

ideasRouter.delete('/:ideaId', (req, res, next) => {
    deleteFromDatabasebyId('ideas', req.idea.id);
    res.status(204).send('Idea deleted');
})

module.exports = ideasRouter;