'use strict'

const User = require('../models/UserModel');
const Deck = require('../models/DeckModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/index');

/**
 *  We can interact with mongoose in three different ways:
 *  ![x] Callback // no longer supported
 *  [x] Promises
 *  [x] Async/await (Promises)
 */
// function encode token for a new user 
const encodeAToken = (userID) => {
    return jwt.sign({
        iss: 'Ngo Trung',
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, JWT_SECRET)
}

const createUser = async (req, res, next) => {
    try {
        const newUser = new User(req.value.body);
        await newUser.save();
        return res.status(201).json({ newUser });
    } catch (err) {
        next(err);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { userID } = req.value.params;
        const user = await User.findByIdAndDelete(userID);
        if (!user) {
            return res.status(404).json({
                error: {
                    message: "User not exist"
                }
            })
        } else {
            return res.status(200).json({
                success: true
            })
        }
    } catch (err) {
        next(err);
    }
}

const createUserDeck = async (req, res, next) => {
    try {
        const { userID } = req.value.params;
        const user = await User.findById(userID);
        if (user === null) {
            return res.status(404).json({
                error: {
                    message: "User not exist"
                }
            })
        } else {
            // create a new Deck
            const newDeck = new Deck(req.value.body);

            // assign user as a deck's owner
            newDeck.owner = user;

            // save new Deck
            await newDeck.save();

            // add deck to user's deck array 'decks'
            user.decks.push(newDeck._id);

            // save user
            await user.save();

            return res.status(201).json({
                success: true,
                deck: newDeck
            })
        }
    } catch (err) {
        next(err);
    }
}

const getUsers = async (req, res, next) => {
    //! Callback way
    // User.find({}, (err, users) => {
    //     if (err) next(err);
    //     return res.status(200).json({ users });
    // })

    //? Promises way
    // User.find({})
    //     .then((users) => {
    //         return res.status(200).json({ users });
    //     })
    //     .catch((err) => next(err));

    //? Async/Await
    try {
        const users = await User.find({});
        return res.status(200).json({ users })
    } catch (err) {
        next(err);
    }
}

const getUserDecks = async (req, res, next) => {
    try {
        const { userID } = req.value.params;
        const user = await User.findById(userID).populate('decks');
        if (user === null) {
            return res.status(404).json({
                error: {
                    message: "User not exist"
                }
            })
        } else {
            return res.status(200).json({
                deck: user.decks
            })
        }

    } catch (err) {
        next(err);
    }
}

const getUserByID = async (req, res, next) => {
    try {
        const { userID } = req.value.params;
        const user = await User.findById(userID);
        return res.status(200).json({ user })
    } catch (err) {
        next(err);
    }
}

const index = (req, res, next) => {
    res.status(200).json({
        message: 'You requested to user handle'
    })
}

const replaceUser = async (req, res, next) => {
    // enforce new user to old user
    try {
        const { userID } = req.value.params;
        const user = await User.findById(userID);
        if (user === null) {
            return res.status(404).json({
                error: {
                    message: "User not exist"
                }
            })
        } else {
            const newUser = req.value.body;
            await User.findByIdAndUpdate(userID, newUser);
            return res.status(200).json({ success: true })
        }
    } catch (err) {
        next(err);
    }
}

const secret = async (req, res, next) => {
    return res.status(200).json({
        resource: true
    })
}

const signin = async (req, res, next) => {
    const user = req.value.body;
    return res.status(200).json({
        message: 'Called to signin function',
        user: user
    })
}

const signup = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.value.body;
    // Check if there is a user with same email
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
        // Create a new user
        const newUser = new User({ firstName, lastName, email, password })
        await newUser.save();
        // Encode a token
        const token = encodeAToken(newUser._id)
        res.setHeader('Authorization', token);
        return res.status(201).json({
            message: 'Sign up successfully'
        })
    } else {
        return res.status(403).json({
            error: {
                message: "Email already exist"
            }
        })
    }
}

const updateUser = async (req, res, next) => {
    // number of fields
    try {
        const { userID } = req.value.params;
        const user = await User.findById(userID);
        if (user === null) {
            return res.status(404).json({
                error: {
                    message: "User not exist"
                }
            })
        } else {
            const newUser = req.value.body;
            await User.findByIdAndUpdate(userID, newUser);
            return res.status(200).json({ success: true })
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createUser,
    createUserDeck,
    deleteUser,
    getUserByID,
    getUsers,
    index,
    getUserDecks,
    replaceUser,
    secret,
    signin,
    signup,
    updateUser,
}
