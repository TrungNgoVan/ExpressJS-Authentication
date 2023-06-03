'use strict'

const express = require('express');
const router = express.Router();
/**
 *!const router = require('express-promise-router')();
 * express-promise-router support handle try-catch.
 */


const UserController = require('../controllers/userController');

const { schemas, validateParam, validateBody } = require('../helpers/routeHelper')

router.route('/')
    .get(
        UserController.getUsers
    )
    .post(
        validateBody(schemas.userSchema),
        UserController.createUser
    )

router.route('/signup')
    .post(
        validateBody(schemas.authSignUpSchema),
        UserController.signup
    )

router.route('/signin')
    .post(
        validateBody(schemas.authSignInSchema),
        UserController.signin
    )

router.route('/secret')
    .get(UserController.secret)

router.route('/:userID')
    .get(
        validateParam(schemas.idSchema, 'userID'),
        UserController.getUserByID
    )
    .put(
        validateParam(schemas.idSchema, 'userID'),
        validateBody(schemas.userSchema),
        UserController.replaceUser
    )
    .patch(
        validateParam(schemas.idSchema, 'userID'),
        validateBody(schemas.userOptionalSchema),
        UserController.updateUser
    )
    .delete(
        validateParam(schemas.idSchema, 'userID'),
        UserController.deleteUser
    )

router.route('/:userID/decks')
    .get(
        validateParam(schemas.idSchema, 'userID'),
        UserController.getUserDecks
    )
    .post(
        validateParam(schemas.idSchema, 'userID'),
        validateBody(schemas.deckSchema),
        UserController.createUserDeck
    )

module.exports = router;
