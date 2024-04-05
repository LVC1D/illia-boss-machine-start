const express = require('express');

const meetingsRouter = express.Router();

const {
    getAllFromDatabase, 
    deleteAllFromDatabase,
    createMeeting,
    addToDatabase
} = require('./db');

meetingsRouter.get('/', (req, res, next) => {
    const meetings = getAllFromDatabase('meetings');
    res.send(meetings);
});

meetingsRouter.post('/', (req, res, next) => {
    const addedMeeting = createMeeting();
    addToDatabase('meetings', addedMeeting);
    res.status(201).send(addedMeeting);
})

meetingsRouter.delete('/', (req, res, next) => {
    deleteAllFromDatabase('meetings');
    res.status(204).send('Meetings abolished!');
})

module.exports = meetingsRouter;