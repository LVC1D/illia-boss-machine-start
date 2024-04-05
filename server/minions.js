const express = require('express');

const minionsRouter = express.Router({mergeParams: true});

const {
    getAllFromDatabase, 
    getFromDatabaseById, 
    addToDatabase, 
    updateInstanceInDatabase,
    deleteFromDatabasebyId
} = require('./db');

minionsRouter.param('minionId', (req, res, next) => {
    const minion = getFromDatabaseById('minions', req.params.minionId);
    if (!minion) {
        res.status(404).send('Minion not found!');
    } else {
        req.minion = minion;
        next();
    }
});

minionsRouter.param('workId', (req, res, next) => {
    const work = getFromDatabaseById('work', req.params.workId);
    if (!work) {
        res.status(404).send('Work not found!');
    } else {
        req.work = work;
        next();
    }
});

/* CRUD */

minionsRouter.get('/', (req, res, next) => {
    const minions = getAllFromDatabase('minions');
    res.send(minions);
});

minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

minionsRouter.post('/', (req, res, next) => {
    const newMinion = req.body;
    if (!newMinion) {
        res.status(400).send('Minion cannot be created!');
    } else {
        const addedMinion = addToDatabase('minions', newMinion);
        res.status(201).send(addedMinion);
    }
});

minionsRouter.put('/:minionId', (req, res, next) => {
    const minionToUpdate = req.body;
    const updatedMinion = updateInstanceInDatabase('minions', minionToUpdate);
    res.send(updatedMinion);
});

minionsRouter.delete('/:minionId', (req, res, next) => {
    deleteFromDatabasebyId('minions', req.minion.id);
    res.status(204).send('Minion deleted');
})

/* Work routes */

minionsRouter.get('/:minionId/work', (req, res, next) => {
    const allWork = getAllFromDatabase('work');
    const minionWork = allWork.filter(work => work.minionId === req.minion.id)
    res.send(minionWork);
});

minionsRouter.post('/:minionId/work', (req, res, next) => {
    const newWork = req.body;
    if (!newWork) {
        res.status(400).send('Work cannot be added!');
    } else {
        const addedWork = addToDatabase('work', newWork);
        res.status(201).send(addedWork);
    } 
});

minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
    const updatedWork = req.body;

    // If the ID's are non-numeric - 404
    if (isNaN(parseInt(req.minion.id)) || isNaN(parseInt(req.work.id))) {
        res.status(404).send('Invalid ID');
        return;
    }

    if (!updatedWork) {
        res.status(404).send('Work not found!');
        return;
    }

    // If the ID of the work doesn't match for the minion ID - 400
    if (updatedWork.minionId !== req.minion.id) {
        res.status(400).send('Invalid request: Work does not belong to specified minion');
        return;
    }

    const updatedWorkInstance = updateInstanceInDatabase('work', updatedWork);

    if (updatedWorkInstance) {
        res.status(200).send(updatedWorkInstance);
    } else {
        res.status(500).send('Internal server error: Failed to update work');
    }
});

minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
    deleteFromDatabasebyId('work', req.work.id);
    res.status(204).send('Work removed!');
})

module.exports = minionsRouter;