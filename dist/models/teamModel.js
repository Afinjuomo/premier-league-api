"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    stadium: {
        type: String,
        required: true
    },
}, { timestamps: true });
// Indexing for faster lookups
teamSchema.index({ name: 1 });
exports.default = (0, mongoose_1.model)('Team', teamSchema);
