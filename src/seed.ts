import mongoose, { Schema, Document } from 'mongoose';

// MongoDB connection string for the test database
const connectionString = 'mongodb://localhost:27017/test-database';

// Define the interface for your fixture
interface IFixture extends Document {
    homeTeam: string;
    awayTeam: string;
    date: Date;
}

// Define your fixture schema
const fixtureSchema: Schema<IFixture> = new Schema({
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
});

// Create the Fixture model
const Fixture = mongoose.model<IFixture>('Fixture', fixtureSchema);

const seedData = async () => {
    try {
        // Connect to the database
        await mongoose.connect(connectionString, {
            
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        await Fixture.deleteMany();

        // Sample data
        const fixturesData = [
            {
                homeTeam: "Team A",
                awayTeam: "Team B",
                date: new Date('2025-10-10')
            },
            {
                homeTeam: "Team C",
                awayTeam: "Team D",
                date: new Date('2025-10-11')
            },
            {
                homeTeam: "Team E",
                awayTeam: "Team F",
                date: new Date('2025-10-12')
            }
        ];

        // Create and insert instances of Fixture model
        const fixtures = fixturesData.map(data => new Fixture(data));
        await Fixture.insertMany(fixtures);
        console.log('Data seeded successfully!');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

// Run the seed function
seedData();
