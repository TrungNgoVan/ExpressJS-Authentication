'use strict'

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})

// ! ENCODE PASSWORD USER
// * Encode before save user (use pre method)
userSchema.pre('save', async function (next) {
    // use normal function, not arrow function, because operator 'this' of arrow function is it.
    try {
        // Generate a salt
        const salt = await bcryptjs.genSalt(10);
        console.log('Salt ', salt);
        // Generate a password hash (salt + hash)
        const passwordHashed = await bcryptjs.hash(this.password, salt);
        // Re-assign password hashed
        console.log('Old password', this.password);
        console.log('Password hashed', passwordHashed);
        this.password = passwordHashed;
        next();
    } catch (err) {
        next(err);
    }
})


userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcryptjs.compare(newPassword, this.password);
    } catch (err) {
        throw new Error(err);
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User;

