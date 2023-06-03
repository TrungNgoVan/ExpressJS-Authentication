'use strict'

const Joi = require('@hapi/joi');
const { schema, validate } = require('../models/UserModel');

const schemas = {
    authSignUpSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required()
    }),
    userOptionalSchema: Joi.object().keys({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email()
    })
    ,
    newDeckSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        description: Joi.string().min(2).required(),
        total: Joi.number().required(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    optionalNewDeck: Joi.object().keys({
        name: Joi.string().min(2),
        description: Joi.string().min(2),
        total: Joi.number(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }),
    deckSchema: Joi.object().keys({
        name: Joi.string().min(2),
        description: Joi.string().min(2),
        total: Joi.number()
    })
}



const validateBody = (schema) => {
    return (req, res, next) => {
        const validateResult = schema.validate(req.body);
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error
            })
        } else {
            if (!req.value) req.value = {};
            if (!req.value['params']) req.value.params = {};
            req.value.body = validateResult.value;
            next();
        }
    }
}

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validateResult = schema.validate({ param: req.params[name] });
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error
            })
        } else {
            // check if not exist then create by empty object
            if (!req.value) req.value = {};
            if (!req.value['params']) req.value.params = {};
            // update value of params 'name' in value.params
            req.value.params[name] = req.params[name];
            next();
        }
    }
}

module.exports = {
    schemas,
    validateParam,
    validateBody
}
