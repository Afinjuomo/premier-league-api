import { Schema, model } from 'mongoose';

const scoreSchema = new Schema({
    homeTeamScore: { type: Number, default: 0 },
    awayTeamScore: { type: Number, default: 0 },
});

const fixtureSchema = new Schema(
    {
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
                validator: (v: Date) => v.getTime() > Date.now(),
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
    },
    { timestamps: true }
);

fixtureSchema.index({ date: 1 });

export default model('Fixture', fixtureSchema);
