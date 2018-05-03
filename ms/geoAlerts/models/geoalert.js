'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GeoAlertSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    name: { 
        type: String,
        required: true
    },
    message: { 
        type: String
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    activated: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    }
});

mongoose.model('GeoAlert', GeoAlertSchema);
