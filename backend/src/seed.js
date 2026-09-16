const connectDB = require("./config/db.js");
const Route = require("./models/Route.js");
const routes = require("./data/routes.js");

const seedDatabase = async () => {
    try {
        await connectDB();

        await Route.deleteMany();

        await Route.insertMany(routes);

        console.log("Database seeded successfully!");

        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();