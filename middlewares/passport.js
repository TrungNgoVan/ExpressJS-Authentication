'use strict'
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/UserModel');

// Strategy: cách thức, phương thức
// Config dotenv
const dotenv = require('dotenv');
dotenv.config();
const { JWT_SECRET } = require('../configs/index')

// import methods of package 'passport-jwt'
const { ExtractJwt } = require('passport-jwt')

// Passport-jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'), // * Token format: Bearer + token 
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}))

// Passport-local 
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false);
        }
        // After authenticating the user by Email, 
        // Next verify the password the user provided is the same as in the database
        const isCorrectPassword = await user.isValidPassword(password); // method in user model.

        if (!isCorrectPassword) {
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}))
