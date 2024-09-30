import bcrypt from 'bcrypt';

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Function to compare a plain password with a hashed password
export const comparePasswords = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};
