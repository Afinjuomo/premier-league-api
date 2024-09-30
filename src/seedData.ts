import mongoose from 'mongoose';
import User from './models/userModel';
import Team from './models/teamModel';
import Fixture from './models/fixtureModel';

const NUM_USERS = 10; // Number of users to create
const NUM_TEAMS = 20; // Number of teams to create
const NUM_FIXTURES = 50; // Number of fixtures to create

async function seedData() {
    try {
        // Clear collections
        await User.deleteMany({});
        await Team.deleteMany({});
        await Fixture.deleteMany({});

        // Seed users
        const users = [];
        for (let i = 0; i < NUM_USERS; i++) {
            const user = new User({
                username: `user${i}`,
                password: 'password123',
                role: i === 0 ? 'admin' : 'user' // First user is admin
            });
            users.push(user.save());
        }
        await Promise.all(users);
        console.log(`Seeded ${NUM_USERS} users`);

        // Seed teams
        const teams = [];
        for (let i = 0; i < NUM_TEAMS; i++) {
            const team = new Team({
                name: `Team${i}`,
                city: `City${i}`,
                stadium: `Stadium${i}`,
            });
            teams.push(team.save());
        }
        const savedTeams = await Promise.all(teams);
        console.log(`Seeded ${NUM_TEAMS} teams`);

        // Seed fixtures
        const fixtures = [];
        for (let i = 0; i < NUM_FIXTURES; i++) {
            const homeTeam = savedTeams[Math.floor(Math.random() * savedTeams.length)].name;
            const awayTeam = savedTeams[Math.floor(Math.random() * savedTeams.length)].name;

            if (homeTeam !== awayTeam) {
                const fixture = new Fixture({
                    homeTeam,
                    awayTeam,
                    date: new Date(Date.now() + Math.random() * 10000000000), // Random future date
                    link: `https://fixture${i}.com`,
                });
                fixtures.push(fixture.save());
            }
        }
        await Promise.all(fixtures);
        console.log(`Seeded ${NUM_FIXTURES} fixtures`);

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

export default seedData;
