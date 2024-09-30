"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const scoreSchema = new mongoose_1.Schema({
    homeTeamScore: { type: Number, default: 0 },
    awayTeamScore: { type: Number, default: 0 },
});
const fixtureSchema = new mongoose_1.Schema({
    homeTeam: {
        type: String,
        required: true
    },
    awayTeam: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: (v) => v.getTime() > Date.now(),
            message: 'Date must be in the future!',
        },
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    score: {
        type: scoreSchema,
        default: () => ({}),
    },
    link: {
        type: String,
        unique: true,
        required: true,
    },
}, { timestamps: true });
fixtureSchema.index({ date: 1 });
exports.default = (0, mongoose_1.model)('Fixture', fixtureSchema);
