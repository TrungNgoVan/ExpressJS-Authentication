'use strict'

const Deck = require('../models/DeckModel');
const User = require('../models/UserModel');

const createDecks = async (req, res, next) => {
    try {
        const deck = req.value.body;
        console.log(deck);
        const owner = await User.findById(deck.owner.toString());
        if (!owner) {
            return res.status(404).json({
                error: {
                    message: "Owner not exist"
                }
            })
        }
        const newDeck = new Deck(deck);
        await newDeck.save();
        owner.decks.push(newDeck._id);
        await owner.save();
        return res.status(201).json({
            owner: owner,
            deck: newDeck
        })
    } catch (err) {
        next(err);
    }
}

const deleteDeck = async (req, res, next) => {
    try {
        const { deckID } = req.value.params;
        const deck = await Deck.findByIdAndDelete(deckID);
        if (!deck) {
            return res.status(404).json({
                error: {
                    message: "Deck not exist"
                }
            })
        } else {
            const ownerID = deck.owner;
            const owner = await User.findById(ownerID);
            const indexOfDeck = owner.decks.indexOf(deckID);
            owner.decks.splice(indexOfDeck, 1);
            await owner.save();
            // owner.decks.pull(deck);
            return res.status(200).json({
                success: true
            });
        }

    } catch (err) {
        next(err);
    }
}

const getDeckByID = async (req, res, next) => {
    try {
        const { deckID } = req.value.params;
        console.log(deckID);
        const deck = await Deck.findById(deckID);
        return res.status(200).json({ deck });
    } catch (err) {
        next(err);
    }
}

const getDecks = async (req, res, next) => {
    try {
        const decks = await Deck.find({});
        return res.status(200).json({ decks });
    } catch (err) {
        next(err);
    }
}

const index = async (req, res, next) => {
    return res.status(200).json({
        message: 'You accessing Deck side'
    })
}

const replaceDeck = async (req, res, next) => {
    const { deckID } = req.value.params;
    // check null deck
    const deck = await Deck.findById(deckID);
    if (deck === null) {
        return res.status(404).json({
            error: {
                message: "Deck not exist"
            }
        })
    }
    else {
        const newDeck = req.value.body;
        await Deck.findByIdAndUpdate(deckID, newDeck);
        return res.status(201).json({
            success: true
        })
    }
}

const updateDeck = async (req, res, next) => {
    const { deckID } = req.value.params;
    // check null deck
    const deck = await Deck.findById(deckID);
    if (deck === null) {
        return res.status(404).json({
            error: {
                message: "Deck not exist"
            }
        })
    }
    else {
        // check change owner 
        const newDeck = req.value.body;
        const newOwnerID = newDeck.owner;
        console.log(newOwnerID);
        const oldOwnerID = deck.owner.toString();
        if (newOwnerID != null && newOwnerID != oldOwnerID) {
            // delete deck in old owner
            const oldOwner = await User.findById(oldOwnerID);
            const indexOfDeck = oldOwner.decks.indexOf(oldOwnerID);
            oldOwner.decks.splice(indexOfDeck, 1);
            await oldOwner.save();

            // add deck to new owner
            const newOwner = await User.findById(newOwnerID);
            newOwner.decks.push(deckID);
            await newOwner.save();
        }
        await Deck.findByIdAndUpdate(deckID, newDeck);
        return res.status(201).json({
            success: true
        })
    }
}

module.exports = {
    createDecks,
    deleteDeck,
    getDeckByID,
    getDecks,
    index,
    replaceDeck,
    updateDeck

}
