'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/geoalert');
const GeoAlert = mongoose.model('GeoAlert');
const _ = require('lodash');

const PUBKEY = 'PUBKEY';

// docker run -p 27017:27017 -d mongo
const mongooseConStr = 'mongodb://localhost/mydb';
mongoose.connect(mongooseConStr);

// Set Port
const port = process.env.PORT || 8081;

// Init app
const app = express();

app.use(bodyParser.json());

// Auth check
app.use((req, res, next) => {
    var auth = _.get(req, 'headers.authorization', null);
    if (auth === null) {
        res.status(401).send({ message: 'Unauthorized' });
    } else {
        jwt.verify(auth.split(' ')[1], PUBKEY, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Unauthorized' });
            }
            else {
                req.user = decode;
                next();
            }
        });
    }
});

// Get alerts
app.get('/alert', (req, res, next) => {
    let limit = Number(req.query.limit) || null;
    let sort = req.query.sort || null;

    let inRange = req.query.inRange || null;
    let activated = req.query.activated === 'true' || null;
    let lat = Number(req.query.lat) || null;
    let long = Number(req.query.long) || null;
    let range = Number(req.query.range) || null;

    if ( (!range && (lat || long)) || (range && !lat && !long) ){
        return res.status(400).send({
            message: 'When filtering by lat and long, range is required. Inverse also applys'
        });
    } else if (sort && sort !== 'created' && sort !== 'distance') {
        return res.status(400).send({
            message: `Sort must be either 'created' or 'distance'`
        });
    } else if (sort === 'distance' && !lat && !long){
        return res.status(400).send({
            message: `'lat' or 'long' are required to sort by distance`
        });
    } else if (req.query.activated && req.query.activated !== 'false' && req.query.activated !== 'true'){
        return res.status(400).send({
            message: `activated must be 'true' or 'false'`
        });
    } else if (inRange && inRange !== 'false' && inRange !== 'true'){
        return res.status(400).send({
            message: `inRange must be 'true' or 'false'`
        });
    }

    let query = {};

    if (lat || long || activated){
        query.$and = [{ username: req.user.username }];
        if (lat){
            if (inRange === 'false'){
                query.$and.push({
                    $or: [
                        { latitude: {
                            $lt: Math.min(lat - range, lat + range)
                        }},
                        { latitude: {
                            $gt: Math.max(lat - range, lat + range)
                        }}
                    ]
                });
            } else {
                query.$and.push({
                    latitude: {
                        $lt: Math.max(lat - range, lat + range),
                        $gt: Math.min(lat - range, lat + range)
                    }
                });
            }
        }
        if (long){
            if (inRange === 'false'){
                query.$and.push({
                    $or: [
                        { longitude: {
                            $lt: Math.min(long - range, long + range)
                        }},
                        { longitude: {
                            $gt: Math.max(long - range, long + range)
                        }}
                    ]
                });
            } else {
                query.$and.push({
                    longitude: {
                        $lt: Math.max(long - range, long + range),
                        $gt: Math.min(long - range, long + range)
                    }
                });
            }
        }
        if (activated){
            query.$and.push({
                activated: activated
            });
        }
    } else {
        query = { username: req.user.username };
    }

    let project = {
        name: 1,
        message: 1,
        latitude: 1,
        longitude: 1,
        activated: 1
    }

    if (sort === 'distance'){
        project.distance = {
            $let: {
                vars: {
                    a: {},
                    b: {}
                },
                in: {
                    $add: [
                        { $pow: [ '$$a', 2 ] }, { $pow: [  '$$b', 2 ] }
                    ]
                }
            }
        };
        if (long){
            project.distance.$let.vars.a = {
                $subtract: [
                    '$longitude', long
                ]
            };
        } else {
            project.distance.$let.vars.a = 0;
        }
        if (lat){
            project.distance.$let.vars.b = {
                $subtract: [
                    '$latitude', lat
                ]
            };
        } else {
            project.distance.$let.vars.b = 0;
        }
    }

    let aggregate = GeoAlert.aggregate().match(query).project(project);

    if (sort === 'distance'){
        aggregate.sort({ distance: 1 });
    } else if (sort === 'created'){
        aggregate.sort({ created: 1 });
    }

    if (limit) aggregate.limit(limit);

    aggregate.exec((err, alerts) => {
        if (err) return next(new Error());
        res.json(alerts);
    });
});

// Creates new alert
app.post('/alert', (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).send({
            message: 'Name is required'
        });
    }
    if (!_.isNumber(req.body.longitude)) {
        return res.status(400).send({
            message: 'Longitude is required'
        });
    }
    if (!_.isNumber(req.body.latitude)) {
        return res.status(400).send({
            message: 'Latitude is required'
        });
    }
    let alert = {
        username: req.user.username,
        name: req.body.name,
        message: req.body.message,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        activated: req.body.activated || false,
        updated: Date.now()
    }
    GeoAlert.create(alert, (err, response) => {
        if (err) return next(new Error());
        res.status(201).json(response);
    }); 
});

// Update an alert
app.patch('/alert/:alertId', (req, res, next) => {
    let alert = {
        updated: Date.now()
    };
    if (req.body.name) alert['name'] = req.body.name;
    if (req.body.message) alert['message'] = req.body.message;
    if (req.body.longitude) alert['longitude'] = req.body.longitude;
    if (req.body.latitude) alert['latitude'] = req.body.latitude;
    if (req.body.activated) alert['activated'] = req.body.activated;

    GeoAlert.update(
        {
            $and: [
                { username: req.user.username },
                { _id: req.params.alertId }
            ]
        },
        {
            $set: alert
        },
        (err, response) => {
            if (err) return next(new Error());
            res.json(response);
        }
    );
});

// Delete alert
app.delete('/alert/:alertId', (req, res, next) => {
    GeoAlert.deleteOne(
        { 
            $and: [
                { username: req.user.username },
                { _id: req.params.alertId }
            ]
        },
        (err) => {
            if (err) return next(new Error());
            res.status(204).send();
        });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: 'Server Error' });
});

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
