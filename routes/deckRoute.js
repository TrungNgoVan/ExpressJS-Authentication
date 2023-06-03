'use strict'

const express = require('express');

const router = express.Router();

const deckController = require('../controllers/deckController');

const { validateBody, validateParam, schemas } = require('../helpers/routeHelper');

router.route('/')
    .get(deckController.getDecks)
    .post(
        validateBody(schemas.newDeckSchema),
        deckController.createDecks
    )

router.route('/:deckID')
    .get(
        validateParam(schemas.idSchema, 'deckID'),
        deckController.getDeckByID
    )
    .put(
        validateParam(schemas.idSchema, 'deckID'),
        validateBody(schemas.newDeckSchema),
        deckController.replaceDeck
    )
    .patch(
        validateParam(schemas.idSchema, 'deckID'),
        validateBody(schemas.optionalNewDeck),
        deckController.updateDeck
    ).delete(
        validateParam(schemas.idSchema, 'deckID'),
        deckController.deleteDeck
    )

module.exports = router;
