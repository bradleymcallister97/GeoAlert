'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('./models/user');
const User = mongoose.model('User');
const _ = require('lodash');

const PUBKEY = 'PUBKEY';

// start docker locally "docker run -p 27017:27017 -d mongo"
const mongooseConStr = 'mongodb://localhost/mydb'
mongoose.connect(mongooseConStr);

// Set Port
const port = process.env.PORT || 8080;

// Init app
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    var auth = _.get(req, 'headers.authorization', null);
    if (auth === null) {
        req.user = undefined;
        next();
    } else {
        jwt.verify(auth.split(' ')[1], PUBKEY, (err, decode) => {
            if (err) req.user = undefined;
            else req.user = decode;
            next();
        });
    }
});

app.post('/register', (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            var newUser = new User(req.body);
            newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
            newUser.save((err, user) => {
                if (err) {
                    return res.status(400).send({
                        message: err
                    });
                }
                user.hash_password = undefined;
                return res.status(201).json(user);
            });
        } else if (user) {
            return res.status(409).send({
                message: 'Username already in use'
            });
        }
    });
});

app.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).json({
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({ message: 'Authentication failed.' });
            } else {
                return res.json({
                    token: jwt.sign({
                        username: user.username,
                        _id: user._id,
                    }, PUBKEY, { expiresIn: '1day' })
                });
            }
        }
    });
});

app.get('/verify', (req, res, next) => {
    if (req.user) {
        return res.json({ msg: 'success' });
    } else {
        return res.status(401).json({
            message: 'Unauthorized user!'
        });
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: 'Server Error' });
});

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
