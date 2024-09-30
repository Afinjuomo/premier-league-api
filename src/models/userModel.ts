import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User extends Document {
    username: string;
    password: string;
    role: 'admin' | 'user';
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
