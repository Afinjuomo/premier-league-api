import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
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

export default model('Team', teamSchema);
